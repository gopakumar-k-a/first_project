const express=require('express')
const user=express()
const userAuth=require('../../middleware/userAuth')



const userController=require('../../controllers/userController/userController')


user.get('/',userController.loadHome)
user.get('/login',userAuth.isLogout,userController.loadLogin)
user.post('/login',userController.checkuser)
user.get('/register',userAuth.isLogout,userAuth.isLogout,userController.loadRegister)
user.post('/register',userController.registerUser)
user.post('/resend-otp',userController.resendOtp)
user.get('/about',userController.loadAbout)
user.get('/contact',userController.loadContact)
user.get('/forgot-password',userController.loadForgotPassword)
user.post('/forgot-password',userController.forgotPass)

// user.get('/otp',userController.loadOtp)
user.post('/verifyotp',userController.checkOtp)

user.get('/logout',userController.logout)
// user.get('/loginCheck',userController.sLogin)
// user.get('/checkRegister',userController)


module.exports=user