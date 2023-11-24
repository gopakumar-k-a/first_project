const express=require('express')
const admin=express()
const adminController=require('../../controllers/adminController/adminController')

admin.get('/',adminController.loadLogin)
admin.post('/',adminController.loadDashboard)

module.exports=admin