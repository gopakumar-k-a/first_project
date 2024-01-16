
const cartModel = require('../../models/cartModel')
const productModel = require('../../models/productModel')
//laoding cart page
const loadCart = async (req, res) => {
    try {
        const user = req.session.userEmail || ''
        const userId = req.session.userId || ''
        const cartData = await cartModel.findOne({ userId: userId }).populate('products.productId')
        const errMessage=req.query.errMessage || ''

        res.render('user/cart', { user, cartData,errMessage })
    } catch (error) {
        console.log(error.message);
    }
}
//add products to the cart
const addTocart = async (req, res) => {
    try {

        const userId = req.session.userId
        const productId = req.query.productId
        const quantity = parseInt(req.query.qty, 10);
        const size = req.query.size
        const cartData = await cartModel.findOne({ userId: userId });
        const productData = await productModel.findOne({ _id: productId })

        const availableQuantity = productData.size[size].quantity
        if (quantity <= availableQuantity) {
            if (cartData) {
                const existingProductWithSameSize = cartData.products.find(item => item.productId.toString() === productId && item.size === size);

                if (existingProductWithSameSize) {
                    existingProductWithSameSize.quantity += quantity;
                } else {


                    const newProduct = {
                        productId: productId,
                        quantity: quantity,
                        size: size
                    };

                    cartData.products.push(newProduct);
                }

                await cartData.save();
            } else {

                const newUserCartData = new cartModel({
                    userId: userId,
                    products: [{
                        productId: productId,
                        quantity: quantity,
                        size: size
                    }]
                });

                await newUserCartData.save();
            }
            res.redirect('/user-cart');
        } else if (quantity > availableQuantity || availableQuantity == 0) {
            res.redirect(`/single-product-view?_id=${productId}&size=${size}`)
        }



    } catch (error) {
        console.log(error.message);
    }
}
//remove product from the cart
const removeProduct = async (req, res) => {
    try {
        const userId = req.session.userId
        const cartId = req.query.cartId
        const cartData = await cartModel.findOne({ userId: userId });
        cartData.products.splice(cartId, 1)
        await cartData.save()
        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.log(error.message);
    }
}
//increase or decrease product quantity from the cart page
const cartQuantity = async (req, res) => {
    try {

        const userId = req.session.userId
        const { productId, operation, size } = req.query
        const cartData = await cartModel.findOne({ userId: userId }).populate('products.productId')
        const matchSize = cartData.products.find((product) => product.productId._id.toString() == productId && product.size == size)
        const maxQuantityOfProduct = await matchSize.productId.size[size].quantity
        const currentQuantityInCart = matchSize.quantity

        if (matchSize) {

            if (operation == 'inc' && currentQuantityInCart < maxQuantityOfProduct) {
                matchSize.quantity += 1
            } else if (operation == 'dec' && currentQuantityInCart > 1) {
                matchSize.quantity -= 1
            }
            await cartData.save()

            res.status(200)

        }




    } catch (error) {
        console.log(error.message);
    }
}


module.exports = { loadCart, addTocart, removeProduct, cartQuantity }