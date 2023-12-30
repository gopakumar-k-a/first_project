const cartModel = require('../../models/cartModel')
const userModel = require('../../models/userModel')
const orderModel = require('../../models/orderModel')
const productModel = require('../../models/productModel')
require('dotenv').config();

const  Razorpay = require('razorpay')
var instance = new Razorpay({
    key_id: process.env.RAZOR_KEY_ID,
    key_secret: process.env.RAZOR_KEY_SECRET,
  });
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
        console.log(paymentMethod,'this is payment method');

        const orderAddress = userData.address[indexOfAddress]
        // console.log('this is address  ' + orderAddress);
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

const onlinePayment=async(req,res)=>{
    try {
        console.log(req.body,'  this is body of online ');
        const userId = req.session.userId

        const { paymentMethod, totalAmount, indexOfAddress } = req.body
        const userData = await userModel.findOne({ _id: userId })
        const cartData = await cartModel.findOne({ userId: userId })
        console.log(paymentMethod,'this is payment method');

        const orderAddress = userData.address[indexOfAddress]
        // console.log('this is address  ' + orderAddress);
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
        

        
       
        var options = {
            amount: parseInt(totalAmount)*100,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "order_rcptid_11"
          };
          instance.orders.create(options,async function(err,razorOrder) {
            if(err){
                console.log('some errror',err);
            }else{
                const newOrder = new orderModel({
                    razorId: razorOrder.id,
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
                console.log(razorOrder);
                res.status(200).json({ message:"Order placed successfully.",razorOrder,totalAmount});
            }
          });
    

    } catch (error) {
       
        console.log(error.message);
    }
}

const changePaymentStatus=async(req,res)=>{
    try {
        console.log(req.body);
        // const orderData=orderModel.findOne({razorId:})
        res.status(200).json({message:'success'})
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


        res.status(200).json({message:'success'})
    } catch (error) {
        console.log(error.message);
    }
}

const orderDetails=async(req,res)=>{
    try {
        const user = req.session.userEmail || ''
        const userId=req.session.userId
        const id=req.query._id
        const orderData=await orderModel.findOne({_id:id,userId:userId}).populate('userId').populate('items.productId')
        res.render('user/orderDet.ejs',{user,orderData})
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadCheckout, placeOrder, cancelOrder,orderDetails,onlinePayment,changePaymentStatus
}