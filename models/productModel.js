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
        type: String,
        required: true
    },
    size: {
        s: {
            quantity: {
                type: Number,
                default: 0
            }

        },
        m: {
            quantity: {
                type: Number,
                default: 0
            }

        },
        l: {
            quantity: {
                type: Number,
                default: 0
            }

        }
    },
    price: {

        salePrice: {
            type: Number,
            required:true
        },
        regularPrice: {
            type: Number,
            required:true
        }
    },
    imagesUrl: {
        type: [String],
        required: true
    },
    isActive: {
        type: Boolean,
        default:true
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
    },
    catStatus:{
      type:Boolean,
      default:true
    },
    leagueStatus:{
        type:Boolean,
        default:true
    },
    brandStatus:{
        type:Boolean,
        default:true
    }


})

const product = mongoose.model('product', productSchema)
module.exports = product