const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        },
        quantity: {
            type: Number
        },
        size: {
            type: String
        }
    }],
    address: [{
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        phone: {
            type: Number,
        },
        altPhone: {
            type: Number,
        },
        houseName: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        pincode: {
            type: Number,
        },
        landMark: {
            type: String,
        },
    }],
    paymentMethod: {
        type: String,
        required: true,
        enum: ['cod', 'upi','wallet']
    },
    totalAmount: {
        type: Number,
        required: true
    },
    orderedAt: {
        type: Date,
        default: () => Date.now()
    },
    orderStatus: {
        type: String,
        default: 'pending',
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled','returned']
    },
    razorId:{
        type:String
    },
    paymentStatus:{
        type:String,
        enum:['pending','success','cancelled','returned']
    },
    amountPaid:{
        type:Number,
        default:0

    },
    walletStatus:{
        type:Boolean,
        default:false

    },
    moneyFromWallet:{
        type:Number,
       
    },
    couponStatus:{
        type:Boolean,
        default:false
    },
    moneyFromCoupon:{
        type:Number,
   
    },
    couponName:{
        type:String
    },
    couponType:{
        type:String
    },
    couponDiscount:{
        type:Number,
      
    },
    returnReason:{
        type:String
    }
});

module.exports = mongoose.model('order', orderSchema);
