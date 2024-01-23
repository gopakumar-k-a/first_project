const wishlistModel = require('../../models/wishlistModel')
// const cartModel = require('../../models/cartModel')
const wishlistHelper=require('../../helper/wishlistHelper')
//load wishlist page
const loadWishList = async (req, res ,next) => {
    try {
        const user = req.session.userId
        const wishlistData=await wishlistHelper.wishListData(user)
        res.render('user/wishlist', { wishlistData, user, errMessage: '', })

    } catch (error) {
        console.log(error.message);
        next(error)

    }
}
//add to wishlist
const addToWish = async (req, res ,next) => {
    try {
        const user = req.session.userId
        const { size, prId } = req.body
        const wishlistData = await wishlistModel.findOne({ userId: user })
        if (user) {
            if (wishlistData) {
                const foundProduct = wishlistData.products.find(product => (
                    product.productId.toString() === prId && product.size === size
                ));
                if (foundProduct) {
                    return res.status(200).json({ message: 'canAdd' })
                } else {
                    const newProduct = {
                        productId: prId,
                        size: size
                    }
                    wishlistData.products.push(newProduct)
                    await wishlistData.save()
                }

            } else {
                const newWishlist = new wishlistModel({
                    userId: user,
                    products: [{
                        productId: prId,
                        size: size
                    }]
                })
                await newWishlist.save()
            }
        } else {
            return res.status(200).json({ message: 'noUser' })
        }
        return res.status(200).json({ message: 'success' })
    } catch (error) {
        console.log(error.message);
        next(error)

    }
}
//remove product from wishlist
const removeProduct = async (req, res ,next) => {
    try {
        const userId = req.session.userId
        const wishIndex = req.query.wishIndex
        const wishData = await wishlistModel.findOne({ userId: userId });
        wishData.products.splice(wishIndex, 1)
        await wishData.save()
        return res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.log(error.message);
        next(error)

    }
}

module.exports = {
    loadWishList,
    addToWish,
    removeProduct
}