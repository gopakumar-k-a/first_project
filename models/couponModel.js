const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    minimumPurchase: {
        type: Number,
        required: true
    },
    limit: {
        type: Number,
        required: true
    },
    flatOffer: {
        type: Number,
        required: false
    },
    discountPercent: {
        type: Number,
        required: false
    },
    description:{
        type:String
    },
    users: [],
    expiryDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
    },
    status:{
        type:Boolean,
        default:true
    }
})

module.exports = mongoose.model('coupon', couponSchema)