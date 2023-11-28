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
            regPrice: {
                type: number,
                default: 0
            },
            salePrice: {
                type: number,
                default: 0
            },
            quantity: {
                type: number,
                default: 0
            }

        },
        m: {
            regPrice: {
                type: number,
                default: 0
            },
            salePrice: {
                type: number,
                default: 0
            },
            quantity: {
                type: number,
                default: 0
            }

        },
        l: {
            regPrice: {
                type: number,
                default: 0
            },
            salePrice: {
                type: number,
                default: 0
            },
            quantity: {
                type: number,
                default: 0
            }

        },
        xl: {
            regPrice: {
                type: number,
                default: 0
            },
            salePrice: {
                type: number,
                default: 0
            },
            quantity: {
                type: number,
                default: 0
            }

        },
        xxl: {
            regPrice: {
                type: number,
                default: 0
            },
            salePrice: {
                type: number,
                default: 0
            },
            quantity: {
                type: number,
                default: 0
            }

        }
    },
    imagesUrl: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    },
    createdAt:{
        type:Date,
        default: () => Date.now()
    }


})

const product=mongoose.model('product',productSchema)
module.exports=product