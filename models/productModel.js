const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    league: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'league'
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'team'
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'brand'
    },
    description: {
        types: String,
        required: true
    },
    size: {
        s: {
            quantity: {
                type: number,
                default: 0
            }

        },
        m: {
            quantity: {
                type: number,
                default: 0
            }

        },
        l: {
            quantity: {
                type: number,
                default: 0
            }

        }
    },
    price: {

        salePrice: {
            type: number,
            required:true
        },
        regularPrice: {
            type: number,
            required:true
        }
    },
    imagesUrl: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default:true
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
    }


})

const product = mongoose.model('product', productSchema)
module.exports = product