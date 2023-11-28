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

//===========product management

//load product management page
admin.get('/category-management',adminController.loadCategory)
//category management
//adding new category
admin.post('/add-category',adminController.addCategory)
//loading update page
admin.get('/edit-cat',adminController.loadEditCategory)
//updating data of category
admin.post('/edit-cat',adminController.updateCatName)


//blocking and unblocking categories
admin.get('/blockCategory',adminController.blockCat)
admin.get('/unblockCategory',adminController.unblockCat)
module.exports=admin