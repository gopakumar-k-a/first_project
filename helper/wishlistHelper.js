
const wishlistModel = require('../models/wishlistModel')
const cartModel = require('../models/cartModel');
const userModel = require('../models/userModel');
//checkingg product in the wishlist is present in the cart or not
async function wishListData(user) {

    try {

        const wishlistData = await wishlistModel.findOne({ userId: user }).populate('products.productId')
        const cartData = await cartModel.findOne({ userId: user })
        if (wishlistData) {
            wishlistData.products.forEach((wishProduct) => {
                if (cartData && cartData.products.length > 0) {
                    const foundInCart = cartData.products.find((cartProduct) => (
                        wishProduct.productId._id.toString() === cartProduct.productId.toString()
                        && wishProduct.size === cartProduct.size
                    ));

                    wishProduct.addedToCart = !!foundInCart;
                } else {

                    wishProduct.addedToCart = false

                }
            });
            await wishlistData.save()

        }
        return wishlistData

    } catch (error) {
        console.log(error.message);
    }
}
//checking product is in wishlist or not
async function wishlistCheck(user, productId, size) {
    try {
        console.log('user ', user);
        console.log('product id ', productId);
        console.log('size ', size);
        const wishlistData=await wishlistModel.findOne({userId:user})
        if(wishlistData && wishlistData.products.length>0){
            const foundProduct = wishlistData.products.find(product => (
                product.productId.toString() === productId && product.size === size
            ));
            console.log('foundProduct ',foundProduct);
            if(foundProduct){
                return true
            }else{
                return false
            }
        }else{
            return false
        }

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    wishListData,
    wishlistCheck
}