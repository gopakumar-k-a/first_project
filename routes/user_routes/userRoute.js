const express=require('express')
const user=express()
user.use(express.urlencoded({extended:true}))
const userController=require('../../controllers/userController/userController')

user.get('/',userController.loadHome)
user.get('/login',userController.loadLogin)
user.post('/login',userController.checkuser)
user.get('/register',userController.loadRegister)
user.post('/register',userController.registerUser)
user.get('/about',userController.loadAbout)
user.get('/contact',userController.loadContact)
user.get('/forgot-password',userController.loadForgotPassword)
// user.get('/loginCheck',userController.sLogin)
// user.get('/checkRegister',userController)


module.exports=user