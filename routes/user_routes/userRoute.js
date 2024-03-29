const express=require('express')
const user=express()
const userAuth=require('../../middleware/userAuth')
const userProductController=require('../../controllers/userController/userProductController')
const userController=require('../../controllers/userController/userController')
const userAddressController=require('../../controllers/userController/userAddressController')
const userCartController=require('../../controllers/userController/userCartController')
const userOrderController=require('../../controllers/userController/userOrderController')
const userWishlistController=require('../../controllers/userController/userWishlistController')
const userReviewController=require('../../controllers/userController/userReviewController')
const session = require('express-session');
require('dotenv').config();


user.use(userAuth.isUserBlock)
//load homepage
user.get('/',userController.loadHome)
//load login page
user.get('/login',userAuth.isLogout,userController.loadLogin)
//check user data
user.post('/login',userController.checkuser)
//load register page
user.get('/register',userAuth.isLogout,userAuth.isLogout,userController.loadRegister)
//check register data
user.post('/register',userController.registerUser)
//load otp page
user.get('/otp',userController.loadOtp)
//check otp
user.post('/verifyotp',userController.checkOtp)
//load resend otp page
user.post('/resend-otp',userController.resendOtp)
//load forgot password page
user.get('/forgot-password',userController.loadForgotPassword)
//change password
user.patch('/changePass',userController.changePassword)
//send otp after checking email for forgot password
user.post('/forgot-password-send-otp',userController.sendForgotOtp)
//load about page
user.get('/about',userController.loadAbout)
//load contact page
user.get('/contact',userController.loadContact)
//send mail through contact us page
user.post('/contact',userController.contactUsMessage)
//user logout
user.get('/logout',userController.logout)
//single product view
user.get('/single-product-view',userProductController.loadSingleProduct)
//product listing
user.get('/shop',userProductController.loadShop)
//search
user.post('/search',userProductController.searchProduct)
//load user dashboard pages
user.get('/user-dashboard',userAuth.isLogin,userController.loadUserDashboard)
//update user credentials
user.post('/user-dashboard',userController.userUpdate)
//add address
user.post('/add-address',userAuth.isLogin,userAddressController.addAddress)
//edit address
user.get('/edit-user-address',userAuth.isLogin,userAddressController.loadAddressEdit)
//update address
user.post('/edit-user-address',userAuth.isLogin,userAddressController.updateAddress)
//delete address
user.delete('/edit-user-address',userAuth.isLogin,userAddressController.deleteAddress)
//laod add to cart
user.get('/user-cart',userAuth.isLogin,userCartController.loadCart)
//add to cart
user.get('/add-to-cart',userAuth.isLogin,userCartController.addTocart)
//remove product from the cart
user.delete('/remove-product',userAuth.isLogin,userCartController.removeProduct)
//to increment or decrement value in cart
user.patch('/cart-quantity',userAuth.isLogin,userCartController.cartQuantity)
//load checkout page
user.get('/checkout',userAuth.isLogin,userOrderController.loadCheckout)
//place order
user.post('/place-order',userAuth.isLogin,userOrderController.placeOrder)
//online payment razor pay
user.post('/online-payment',userAuth.isLogin,userOrderController.onlinePayment)
//cancel  the order
user.patch('/cancel-order',userAuth.isLogin,userOrderController.cancelOrder)
//return order
user.patch('/return-order',userAuth.isLogin,userOrderController.returnOrder)
//show each of order details of user
user.get('/order-details',userAuth.isLogin,userOrderController.orderDetails)
//give coupon details to checkout
user.get('/get-coupon-data',userAuth.isLogin,userOrderController.couponDetails)
//give walllet details to checkout
user.get('/get-wallet-data',userAuth.isLogin,userOrderController.walletApply)
//load wishlist
user.get('/wishlist',userAuth.isLogin,userWishlistController.loadWishList)
//add product to wishList
user.post('/add-to-wish',userWishlistController.addToWish)
//remove product from wishlist
user.delete('/remove-from-wishlist',userAuth.isLogin,userWishlistController.removeProduct)
//add review to products 
user.post('/createProductReview',userAuth.isLogin,userReviewController.addNewReview)








module.exports=user