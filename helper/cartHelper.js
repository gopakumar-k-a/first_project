const cartModel = require('../models/cartModel')

async function updateQuantity(userId) {
    try {
        const cart = await cartModel.findOne({ userId }).populate('products.productId');
        let notEnoughQty = 0
        if (cart) {
            if (cart.products.length > 0) {
                for (const userCartItem of cart.products) {
                    const singleProductQty = userCartItem.quantity
                    const singleProductSize = userCartItem.size
                    const quantityAvailable = userCartItem.productId.size[singleProductSize].quantity
                    if (singleProductQty > quantityAvailable || quantityAvailable == 0) {
                        notEnoughQty++
                    }
                }
                if (notEnoughQty > 0) {
                    return false
                } else {
                    return true
                }
            } else {
                return false
            }

        } else {

            console.log(`Cart not found for userId: ${userId}`);
            return false;

        }


    } catch (error) {
        console.error(error);

    }
}



const cartTotal = async (user) => {
    try {
        const cartData = await cartModel.findOne({ userId: user }).populate('products.productId')
        console.log('this is helper cart data  ', cartData);
        const total = cartData.products.reduce((acc, item) => {
            let qty = item.quantity
            let price = item.productId.price.salePrice
            acc += (qty * price)
            return acc

        }, 0)
        return total

    } catch (error) {
        console.log(error.message);
    }
}






module.exports = { updateQuantity, cartTotal }