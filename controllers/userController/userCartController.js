
const cartModel = require('../../models/cartModel')


const loadCart = async (req, res) => {
    try {
        const user = req.session.userEmail || ''
        const userId = req.session.userId || ''

        const cartData = await cartModel.find({ userId: userId }).populate('productId').populate('userId')


        await res.render('user/cart', { user, cartData })
    } catch (error) {
        console.log(error.message);
    }
}

const addTocart = async (req, res) => {
    try {

        const userId = req.session.userId
        const productId = req.query.productId
        const quantity = parseInt(req.query.qty, 10);
        const size = req.query.size

        const cartData = await cartModel.find({ productId: productId, userId: userId });
        console.log(cartData + '  this is cartdata');
        if (cartData.length > 0) {
            // Product with the same productId is found in the cart
            const productWithSameSize = cartData.find(item => item.size === size);
            console.log(productWithSameSize + '  product with same size');
            if (productWithSameSize) {
                // Product with the same size is found, update the quantity
                await cartModel.updateOne(
                    { userId: userId, productId: productId, size: size },
                    { $inc: { quantity: quantity } }
                );
                res.redirect('/user-cart')
            } else {
                // Product with the same productId is found but not with the same size, add a new item
                const newData = new cartModel({
                    userId: userId,
                    productId: productId,
                    quantity: quantity,
                    size: size,
                });
                await newData.save();
                res.redirect('/user-cart')
            }
        } else {
            const data = new cartModel({
                userId: userId,
                productId: productId,
                quantity: quantity,
                size: size
            })
            await data.save()
            res.redirect('/user-cart')
        }



    } catch (error) {
        console.log(error.message);
    }
}
//remove quantity from cart
const removeProduct = async (req, res) => {
    try {
        const cartId = req.query.cartId
        console.log('cart removing id  ' + cartId);
        await cartModel.findByIdAndDelete(cartId)
        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.log(error.message);
    }
}
//increment or decerment quantity in cart
const cartQuantity = async (req, res) => {
    try {
        const cartId = req.query.cartId
        const operation = req.query.operation
        const size = req.query.size
        const cartQuantityObject = await cartModel.findOne({ _id: cartId }).populate('productId');
        const stockLeft = cartQuantityObject.productId.size[size].quantity
        const cartQuantity = cartQuantityObject.quantity;




        if (operation == 'inc' && cartQuantity < stockLeft) {
            await cartModel.updateOne({ _id: cartId }, { $inc: { quantity: 1 } })
        }
        if (operation == 'dec' && cartQuantity > 1) {
            await cartModel.updateOne({ _id: cartId }, { $inc: { quantity: -1 } })
        }


        res.status(200).json({ message: 'quantity updated successfully' });


    } catch (error) {
        console.log(error.message);
    }
}

module.exports = { loadCart, addTocart, removeProduct, cartQuantity }