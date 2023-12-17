const mongoose = require("mongoose");


const addToCartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
        },
        quantity: {
            type: Number,
        },
        size: {
            type: String
        }
    }]

   
  

});
const cart = mongoose.model("Cart", addToCartSchema);
module.exports = cart;