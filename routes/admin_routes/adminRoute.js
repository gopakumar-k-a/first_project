const express=require('express')
const admin=express()
const adminController=require('../../controllers/adminController/adminController')

const productController=require('../../controllers/adminController/productController')
//requiring storage engine for multer
const upload=require('../../multer')

//load login page page
admin.get('/',adminController.loadLogin)
//load dashboard(dummy content)
admin.post('/',adminController.checkAdmin)
//load dashboard page
admin.get('/dashboard',adminController.loadDashboard)






//load projectlist page
admin.get('/product-list',productController.loadProjectList)
//load addproduct page
admin.get('/add-product',productController.loadAddProduct)

//===========product management====================

//load product management page
admin.get('/category-management',productController.loadCategory)
// category management=========================


// ------category--management--------------
//inserting new category
admin.post('/add-category',productController.addCategory)
//updating data of category
admin.post('/edit-cat',productController.updateCatName)
//blocking categories
admin.get('/blockCategory',productController.blockCat)
//unblocking categories
admin.get('/unblockCategory',productController.unblockCat)

//----------------------league-management--------------
//inserting data of league
admin.post('/add-league',productController.insertLeague)
//updating data of league
admin.post('/edit-league',productController.updateLeagueName)
//blocking leagues
admin.get('/blockLeague',productController.blockLeague)
//unblocking leagues
admin.get('/unblockLeague',productController.unblockLeague)


//------------------------team-management---------------------------
//inserting  data of team
admin.post('/add-team',productController.insertTeam)
//updating data of team
admin.post('/edit-team',productController.updateTeamName)
//blocking team
admin.get('/blockTeam',productController.blockTeam)
//unblocking team
admin.get('/unblockTeam',productController.unblockTeam)


//-----------------------brand-management-------------------------
//inserting new brand
admin.post('/add-brand',upload.single('brandInput'),productController.insertBrand)
//update-brand
admin.post('/edit-brand',productController.updateBrandName)

//blocking brand
admin.get('/block-brand',productController.blockBrand)
//unblocking brand
admin.get('/unblock-brand',productController.unblockBrand)













module.exports=admin