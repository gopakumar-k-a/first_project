const cartModel = require('../../models/cartModel')
const userModel = require('../../models/userModel')
const orderModel = require('../../models/orderModel')
const productModel = require('../../models/productModel')

const loadCheckout = async (req, res) => {
    try {
        const userId = req.session.userId
        const user = req.session.userEmail || ''
        const cartData = await cartModel.findOne({ userId: userId }).populate('products.productId').populate('userId')
        console.log('this is cart Data  ' + cartData);
        res.render('user/checkout', { user, cartData })
    } catch (error) {
        console.log(error.message);
    }
}

const placeOrder = async (req, res) => {
    try {
        const userId = req.session.userId

        const { paymentMethod, totalAmount, indexOfAddress } = req.body
        const userData = await userModel.findOne({ _id: userId })
        const cartData = await cartModel.findOne({ userId: userId })

        const orderAddress = userData.address[indexOfAddress]
        console.log('this is address  ' + orderAddress);
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
        const newOrder = new orderModel({
            orderId: orderId,
            userId: cartData.userId,
            items: orderProducts,
            address: orderAddress,
            paymentMethod: paymentMethod,
            totalAmount: totalAmount,
        })
        await newOrder.save()

        cartData.products = []
        await cartData.save()
        res.status(200).send({ message: 'success' })
    } catch (error) {
        console.log(error.message);
    }
}

const cancelOrder = async (req, res) => {
    try {
        const { id } = req.body
        const orderData = await orderModel.findOne({ _id: id })
        console.log('this is order data' + orderData);
        for (const orderProduct of orderData.items) {
            const product = await productModel.findOne({ _id: orderProduct.productId })
            const size = orderProduct.size
            const orderedQuantity = orderProduct.quantity
            product.size[size].quantity += orderedQuantity
            product.save()

        }
        orderData.orderStatus = "cancelled"
        orderData.save()


        res.status(200)
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadCheckout, placeOrder, cancelOrder
}