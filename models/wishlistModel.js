const mongoose = require('mongoose')

const wishListSchema = ({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        },
        size: {
            type: String,
            enum: ['s', 'm', 'l']
        },
        addedToCart:{
            type:Boolean,
            default:false
        }
    }]

})

module.exports = mongoose.model('wishlist', wishListSchema)