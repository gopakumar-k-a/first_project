const orderModel = require('../../models/orderModel')
const mongoose=require('mongoose')

const loadOrderDetails = async (req, res) => {
    try {
        const id = req.body._id
        const orderData = await orderModel.find({ userId: id })
        // console.log(orderData);
        res.render('admin/orderDetails', { orderData })
    } catch (error) {
        console.log(error.message);
    }
}
//changing status of the order
const changeOrderStatus = async (req, res) => {
    try {
        console.log('order id');
        console.log(req.body);
        const { idOforder, orderStatusSelect } = req.body
        const orderData = await orderModel.findOne({ _id: idOforder })
        //  ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
        if (orderStatusSelect) {

            const status = orderStatusSelect === 'pending' ? 'pending' :
                orderStatusSelect === 'processing' ? 'processing' :
                    orderStatusSelect === 'shipped' ? 'shipped' :
                        orderStatusSelect === 'delivered' ? 'delivered' :
                            orderStatusSelect === 'cancelled' ? 'cancelled' :
                                'unknown';
            orderData.orderStatus = status
            await orderData.save()
        }
        res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.log(error.message);
    }
}

const loadAllOrders = async (req, res) => {
    try {
        const page = req.query.page || 1
        const count = await orderModel.find().count()
        const limit = 10
        const skip = (page - 1) * limit
        const orderData = await orderModel.find({}).sort({ orderedAt: -1 }).limit(limit).skip(skip)
        const userIndices = orderData.map((user, index) => index + 1 + skip);

        // console.log(orderData);
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
const loadSingleOrderDetails = async (req, res) => {
    try {
        const id =new mongoose.Types.ObjectId(req.query._id);
        const orderData=await orderModel.findOne({_id:id}).populate('userId').populate('items.productId')

        console.log(orderData);
        res.render('admin/singleOrderDetails', { orderData });
    } catch (error) {
        console.log(error);
    }
};




module.exports = {
    loadOrderDetails, changeOrderStatus, loadAllOrders, loadSingleOrderDetails
}