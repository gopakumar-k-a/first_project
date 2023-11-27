const express=require('express')
const admin=express()
const adminController=require('../../controllers/adminController/adminController')


//load login page page
admin.get('/',adminController.loadLogin)
//load dashboard(dummy content)
admin.post('/',adminController.loadDashboard)
//load dashboard page
admin.get('/dashboard',adminController.loadDashboard)
//load projectlist page
admin.get('/product-list',adminController.loadProjectList)
//load addproduct page
admin.get('/add-product',adminController.loadAddProduct)
//load product management page
admin.get('/category-management',adminController.loadCategory)

module.exports=admin