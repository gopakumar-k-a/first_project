const express=require('express')
const user=express()
const session = require('express-session');
require('dotenv').config();



user.use(express.urlencoded({extended:true}))
// Use the session middleware
user.use(session({
    secret:  process.env.SECRET_KEY, 
    resave: false,
    saveUninitialized: false
    // Additional options can be configured as needed
  }));
const userController=require('../../controllers/userController/userController')


user.get('/',userController.loadHome)
user.get('/login',userController.loadLogin)
user.post('/login',userController.checkuser)
user.get('/register',userController.loadRegister)
user.post('/register',userController.registerUser)
user.post('/resend-otp',userController.resendOtp)
user.get('/about',userController.loadAbout)
user.get('/contact',userController.loadContact)
user.get('/forgot-password',userController.loadForgotPassword)

// user.get('/otp',userController.loadOtp)
user.post('/verifyotp',userController.checkOtp)

user.get('/logout',userController.logout)
// user.get('/loginCheck',userController.sLogin)
// user.get('/checkRegister',userController)


module.exports=user