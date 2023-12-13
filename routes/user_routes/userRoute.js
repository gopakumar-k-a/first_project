const express=require('express')
const user=express()
const userAuth=require('../../middleware/userAuth')


const userProductController=require('../../controllers/userController/userProductController')
const userController=require('../../controllers/userController/userController')
const userAddressController=require('../../controllers/userController/userAddressController')
const userCartController=require('../../controllers/userController/userCartController')
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
//load about page
user.get('/about',userController.loadAbout)
//load contact page
user.get('/contact',userController.loadContact)
//user logout
user.get('/logout',userController.logout)
//single product view
user.get('/single-product-view',userProductController.loadSingleProduct)
//product listing
user.get('/shop',userProductController.loadShop)
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




module.exports=user