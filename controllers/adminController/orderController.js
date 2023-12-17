const orderModel = require('../../models/orderModel')



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



module.exports = {
    loadOrderDetails, changeOrderStatus
}