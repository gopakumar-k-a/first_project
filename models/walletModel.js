const mongoose = require('mongoose')

const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    balance: {
        type: Number
    },
    history: [
        {
            amount: {
                type: Number
            },
            type: {
                type: String,
                enum: ['credit', 'debit']
            },
            createdAt: {
                type: Date,
                default: () => Date.now()
            }
        }
    ],
    
})

module.exports = mongoose.model('wallet', walletSchema)