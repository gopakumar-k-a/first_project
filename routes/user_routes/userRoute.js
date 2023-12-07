const express=require('express')
const user=express()
const userAuth=require('../../middleware/userAuth')


const userProductController=require('../../controllers/userController/userProductController')
const userController=require('../../controllers/userController/userController')
const userAddressController=require('../../controllers/userController/userAddressController')

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
user.get('/user-dashboard',userController.loadUserDashbboard)
//update user credentials
user.post('/user-dashboard',userController.userUpdate)
//add address
user.post('/add-address',userAddressController.addAddress)



module.exports=user