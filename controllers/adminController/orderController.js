const orderModel = require('../../models/orderModel')
const productModel=require('../../models/productModel')
const walletModel=require('../../models/walletModel')
const mongoose = require('mongoose')
//load order details of user
const loadOrderDetails = async (req, res) => {
    try {
        const id = req.query.id
        const orderData = await orderModel.find({ userId: id }).sort({orderedAt:-1})
        res.render('admin/orderDetails', { orderData })
    } catch (error) {
        console.log(error.message);
    }
}
//changing status of the order
const changeOrderStatus = async (req, res) => {
    try {

        const { idOforder, orderStatusSelect } = req.body
        const orderData = await orderModel.findOne({ _id: idOforder })
        //  ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
   


        const status = orderStatusSelect
        orderData.orderStatus = status
        if(status=='cancelled'){
            const userId = orderData.userId
            for (const orderProduct of orderData.items) {
                const product = await productModel.findOne({ _id: orderProduct.productId })
                const size = orderProduct.size
                const orderedQuantity = orderProduct.quantity
                product.size[size].quantity += orderedQuantity
                product.save()
    
            }
            orderData.orderStatus = "cancelled"
            orderData.paymentStatus = "cancelled"
        // enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled','returned']

            if (orderData.paymentMethod == 'upi' || orderData.paymentMethod == 'wallet' || orderData.paymentMethod=='cod' && orderData.orderStatus=='delivered') {
                const walletData = await walletModel.findOne({ userId: userId })
                console.log('this is wallet data  ',walletData );
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
        }
        console.log('this is status ', status);
        if (orderData.paymentMethod == 'cod') {
            if (status == 'pending' || status == 'processing' || status == 'shipped') {
                orderData.paymentStatus = 'pending'
            } else if (status == 'delivered') {
                orderData.paymentStatus = 'success'
            } else if (status == 'cancelled') {
                orderData.paymentStatus = 'cancelled'
            }
        }
        if (orderData.paymentMethod == 'upi' || orderData.paymentMethod == 'wallet') {
            if (status == 'cancelled') {
                orderData.paymentStatus = 'cancelled'
            } else {
                orderData.paymentStatus = 'success'
            }
        }
        await orderData.save()

        res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.log(error.message);
    }
}
//load order list
const loadAllOrders = async (req, res) => {
    try {
        const page = req.query.page || 1
        const count = await orderModel.find().count()
        const limit = 10
        const skip = (page - 1) * limit
        const orderData = await orderModel.find({}).sort({ orderedAt: -1 }).limit(limit).skip(skip)
        const userIndices = orderData.map((user, index) => index + 1 + skip);
        res.render('admin/allOrders', {
            orderData,
            userIndices: userIndices,
            pageCount: Math.ceil(count / limit),
            currentPage: page,
            limit: limit
        })
    } catch (error) {
        console.log(error.message);
    }
}
//load single order details
const loadSingleOrderDetails = async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.query._id);
        const orderData = await orderModel.findOne({ _id: id }).populate('userId').populate('items.productId')
        res.render('admin/singleOrderDetails', { orderData });
    } catch (error) {
        console.log(error);
    }
};




module.exports = {
    loadOrderDetails, changeOrderStatus, loadAllOrders, loadSingleOrderDetails
}