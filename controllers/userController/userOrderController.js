const cartModel = require('../../models/cartModel')
const userModel = require('../../models/userModel')
const orderModel = require('../../models/orderModel')
const productModel = require('../../models/productModel')
const walletModel = require('../../models/walletModel')
const couponModel = require('../../models/couponModel')
require('dotenv').config();

const Razorpay = require('razorpay')
var instance = new Razorpay({
    key_id: process.env.RAZOR_KEY_ID,
    key_secret: process.env.RAZOR_KEY_SECRET,
});
const loadCheckout = async (req, res) => {
    try {
        const userId = req.session.userId
        const user = req.session.userEmail || ''
        const cartData = await cartModel.findOne({ userId: userId }).populate('products.productId').populate('userId')
        let couponData = []
        const walletData = await walletModel.findOne({ userId: userId })

        if (cartData && cartData.products.length > 0) {
            let totalPrice = 0
            cartData.products.forEach((product) => {
                totalPrice += product.quantity * (product.productId.price.salePrice)
            })
            // console.log('cart data total',totalPrice);
            // couponData = await couponModel.find({ minimumPurchase: { $lte: totalPrice } })
            couponData = await couponModel.aggregate([
                {
                    $match: {
                        users: { $nin: [userId] },
                        limit: { $gt: 0 },
                        minimumPurchase: { $lte: totalPrice },
                        expiryDate: { $gt: new Date() },
                        isActive: true

                    }
                }
            ]);

            // console.log('coupon data',couponData);
        }
        // console.log('this is cart Data  ' + cartData);
        res.render('user/checkout', { user, cartData, couponData, walletData })
    } catch (error) {
        console.log(error.message);
    }
}
//fetch coupon data to checkout
const couponDetails = async (req, res) => {
    try {
        const userId = req.session.userId;
        console.log(req.query);
        const { name, total } = req.query;
        let appliedValue = 0;
        let couponType = '';
        let discountPrice = 0;
        let discountValue = 0;

        if (total > 0) {
            const singleCoupon = await couponModel.findOne({ name: name });

            if (singleCoupon !== null && singleCoupon !== undefined) {
                const couponName = singleCoupon.name;

                // Check if the user has already applied the coupon
                if (singleCoupon.users.includes(userId)) {
                    return res.status(200).json({ message: 'alreadyApplied', couponType, discountPrice, discountValue, couponName });
                }

                if (singleCoupon.flatOffer > 0) {
                    appliedValue = total - singleCoupon.flatOffer;
                    couponType = 'flat';
                    discountValue = singleCoupon.flatOffer;
                    discountPrice = total - appliedValue;
                } else if (singleCoupon.discountPercent > 0) {
                    appliedValue = (total * singleCoupon.discountPercent) / 100;
                    couponType = 'percentage';
                    discountValue = singleCoupon.discountPercent;
                    discountPrice = total - appliedValue;
                }

                if (appliedValue < 0) {
                    appliedValue = 0;
                    res.status(200).json({ message: 'cantApply', couponType, discountPrice, discountValue, couponName });
                } else {
                    // Add the user to the list of users who have applied the coupon
                    singleCoupon.users.push(userId);
                    await singleCoupon.save();

                    res.status(200).json({ message: 'success', couponType, discountPrice, discountValue, couponName });
                }
            } else {
                res.status(200).json({ message: 'notFound' });
            }
        } else {
            res.status(200).json({ message: 'cantApply' });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
};


//fetch walllet data to the checkout
const walletApply = async (req, res) => {
    try {
        const userId = req.session.userId
        console.log('query of wallet apply', req.query);
        console.log('inside wallet apply');
        const total = parseInt(req.query.total)
        const couponCheck = parseInt(req.query.couponCheck) || 0
        let walletBal = 0
        console.log('this is total ', total, ' coupon check ', couponCheck);
        if (total > 0) {
            const walletDet = await walletModel.findOne({ userId: userId })
            if (walletDet && walletDet != null) {
                walletBal = walletDet.balance
                let moneyRequired = 0
                console.log('wallet bal before coupon check  ', walletBal);
                if (walletBal >= total) {
                    // moneyRequired = total - couponCheck
                    // console.log('moneyRequired ', moneyRequired);
                    // walletBal -= moneyRequired
                    // moneyRequired = total - couponCheck
                    // moneyRequired = total - couponCheck
                    // moneyRequired = total - couponCheck
                    moneyRequired = total
                    if (couponCheck > 0) {
                        walletBal -= (total + couponCheck)
                    } else {
                        walletBal -= total

                    }

                } else {
                    moneyRequired = walletBal
                    walletBal = 0
                    console.log('moneyRequired ', moneyRequired);

                }

                console.log('wallet bal after coupon check ', walletBal, moneyRequired);
                res.status(200).json({ message: 'success', walletBal, moneyRequired })
            }
        } else {
            res.status(200).json({ message: 'failed', walletBal, moneyRequired })
        }

    } catch (error) {
        console.log(error.message);
    }
}

const placeOrder = async (req, res) => {
    try {
        const userId = req.session.userId

        const { paymentMethod, totalAmount, indexOfAddress,
            razId, amountPaid, walletStatus, moneyFromWallet,
            couponStatus, moneyFromCoupon, couponName, couponType, couponDiscount } = req.body
        console.log(req.body);
        const userData = await userModel.findOne({ _id: userId })
        const cartData = await cartModel.findOne({ userId: userId })
        let paymentStatus = ''
        if (paymentMethod == 'upi') {
            paymentStatus = 'success'
        } else if (paymentMethod == 'cod') {
            paymentStatus = 'pending'
        } else if (paymentMethod == 'wallet') {
            paymentStatus = 'success'
        }
        const orderAddress = userData.address[indexOfAddress]
        let generatedID = Math.floor(100000 + Math.random() * 900000);
        let existingOrder = await orderModel.findOne({ orderID: generatedID });
        while (existingOrder) {
            generatedID = Math.floor(100000 + Math.random() * 900000);
            existingOrder = await orderModel.findOne({ orderID: generatedID });
        }
        const orderId = `ORD${generatedID}`;
        const orderProducts = cartData.products.map((product) => ({
            productId: product.productId,
            quantity: product.quantity,
            size: product.size
        }))
        for (const orderProduct of orderProducts) {
            const product = await productModel.findById(orderProduct.productId);
            const orderedSize = orderProduct.size;
            const orderedQuantity = orderProduct.quantity;
            product.size[orderedSize].quantity -= orderedQuantity;
            await product.save();
        }
        if (walletStatus) {
            const walletData = await walletModel.findOne({ userId: userId })
            // console.log('this is wallet data',walletData);
            const historyData = {
                amount: moneyFromWallet,
                type: 'debit'
            }

            walletData.balance -= moneyFromWallet
            walletData.history.push(historyData)
            await walletData.save()

        }
        if (couponStatus) {
            const couponData = await couponModel.findOne({ name: couponName })
            couponData.users.push(userId)
            await couponData.save()
            // console.log('this is coupon Data',couponData);
        }
        const newOrder = new orderModel({
            orderId: orderId,
            userId: cartData.userId,
            items: orderProducts,
            address: orderAddress,
            paymentMethod: paymentMethod,
            totalAmount: totalAmount,
            paymentStatus: paymentStatus,
            razorId: razId,
            amountPaid: amountPaid,
            walletStatus: walletStatus,
            moneyFromWallet: moneyFromWallet,
            couponStatus: couponStatus,
            moneyFromCoupon: moneyFromCoupon,
            couponName: couponName,
            couponType: couponType,
            couponDiscount: couponDiscount

        })
        await newOrder.save()

        cartData.products = []
        await cartData.save()
        res.status(200).send({ message: 'success' })
    } catch (error) {
        console.log(error.message);
    }
}

const onlinePayment = async (req, res) => {
    try {

        const { totalAmount } = req.body
        var options = {
            amount: parseInt(totalAmount) * 100,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "order_rcptid_11"
        };
        instance.orders.create(options, async function (err, razorOrder) {
            if (err) {
                console.log('some errror', err);
            } else {
                res.status(200).json({ message: "Payment successfull.", razorOrder, totalAmount });
            }
        });


    } catch (error) {

        console.log(error.message);
    }
}



const cancelOrder = async (req, res) => {
    try {
        const userId = req.session.userId
        const { id } = req.body
        const orderData = await orderModel.findOne({ _id: id })
        for (const orderProduct of orderData.items) {
            const product = await productModel.findOne({ _id: orderProduct.productId })
            const size = orderProduct.size
            const orderedQuantity = orderProduct.quantity
            product.size[size].quantity += orderedQuantity
            product.save()

        }
        orderData.orderStatus = "cancelled"
        orderData.paymentStatus = "cancelled"
        if (orderData.paymentMethod == 'upi' || orderData.paymentMethod == 'wallet' || orderData.paymentMethod == 'cod' && orderData.orderStatus == 'delivered') {
            const walletData = await walletModel.findOne({ userId: userId })
            const historyData = {
                amount: orderData.totalAmount,
                type: 'credit'
            }
            if (walletData) {
                walletData.balance += orderData.totalAmount
                walletData.history.push(historyData)
                await walletData.save()
            } else {
                const createWallet = new walletModel({
                    userId: userId,
                    balance: orderData.totalAmount,
                    history: historyData

                })
                await createWallet.save()
            }

        }
        await orderData.save()


        res.status(200).json({ message: 'success' })
    } catch (error) {
        console.log(error.message);
    }
}

const returnOrder = async (req, res) => {
    try {
        const userId = req.session.userId
        console.log(req.body);
        const { id, returnReason } = req.body
        const orderData = await orderModel.findOne({ _id: id })
        for (const orderProduct of orderData.items) {
            const product = await productModel.findOne({ _id: orderProduct.productId })
            const size = orderProduct.size
            const orderedQuantity = orderProduct.quantity
            product.size[size].quantity += orderedQuantity
            product.save()

        }
        orderData.orderStatus = "returned"
        orderData.paymentStatus = "returned"
        orderData.returnReason = returnReason

        const walletData = await walletModel.findOne({ userId: userId })
        const historyData = {
            amount: orderData.totalAmount,
            type: 'credit'
        }

        if (walletData) {
            walletData.balance += orderData.totalAmount
            walletData.history.push(historyData)
            await walletData.save()
        } else {
            const createWallet = new walletModel({
                userId: userId,
                balance: orderData.totalAmount,
                history: historyData

            })
            await createWallet.save()
        }


        await orderData.save()


        res.status(200).json({ message: 'success' })
    } catch (error) {
        console.log(error.message);
    }
}

const orderDetails = async (req, res) => {
    try {
        const user = req.session.userEmail || ''
        const userId = req.session.userId
        const id = req.query._id
        const orderData = await orderModel.findOne({ _id: id, userId: userId }).populate('userId').populate('items.productId')
        res.render('user/orderDet.ejs', { user, orderData })
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadCheckout, placeOrder, cancelOrder,
    orderDetails, onlinePayment, couponDetails, walletApply,
    returnOrder
}