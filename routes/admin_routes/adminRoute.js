const express=require('express')
const admin=express()
const adminController=require('../../controllers/adminController/adminController')

const productController=require('../../controllers/adminController/productController')
//requiring storage engine for multer
const upload=require('../../multer')
//admin auth
const adminAuth=require('../../middleware/adminAuth')

//load login page page
admin.get('/',adminAuth.isLogout,adminController.loadLogin)
//load dashboard(dummy content)
admin.post('/',adminController.checkAdmin)
//logout
admin.get('/logout',adminAuth.isLogin,adminController.logout)
//load dashboard page
admin.get('/dashboard',adminAuth.isLogin,adminAuth.isLogin,adminController.loadDashboard)
//load users list
admin.get('/edit-users',adminAuth.isLogin,adminController.loadUsersList)
//block user
admin.get('/block-user',adminAuth.isLogin,adminController.blockUser)
//unblock user
admin.get('/unblock-user',adminAuth.isLogin,adminController.unBlockUser)




//load projectlist page
admin.get('/product-list',adminAuth.isLogin,productController.loadProjectList)
//load addproduct page
admin.get('/add-product',adminAuth.isLogin,productController.loadAddProduct)
admin.get('/edit-product',adminAuth.isLogin,productController.loadEditProduct)

//===========product management====================

//load product management page
admin.get('/category-management',adminAuth.isLogin,productController.loadCategory)
// category management=========================


// ------category--management--------------
//inserting new category
admin.post('/add-category',adminAuth.isLogin,productController.addCategory)
//updating data of category
admin.post('/edit-cat',adminAuth.isLogin,productController.updateCatName)
//blocking categories
admin.get('/blockCategory',adminAuth.isLogin,productController.blockCat)
//unblocking categories
admin.get('/unblockCategory',adminAuth.isLogin,productController.unblockCat)

//----------------------league-management--------------
//inserting data of league
admin.post('/add-league',adminAuth.isLogin,productController.insertLeague)
//updating data of league
admin.post('/edit-league',productController.updateLeagueName)
//blocking leagues
admin.get('/blockLeague',adminAuth.isLogin,productController.blockLeague)
//unblocking leagues
admin.get('/unblockLeague',adminAuth.isLogin,productController.unblockLeague)


//------------------------team-management---------------------------
//inserting  data of team
admin.post('/add-team',adminAuth.isLogin,productController.insertTeam)
//updating data of team
admin.post('/edit-team',adminAuth.isLogin,productController.updateTeamName)
//blocking team
// admin.get('/blockTeam',productController.blockTeam)
// //unblocking team
// admin.get('/unblockTeam',productController.unblockTeam)


//-----------------------brand-management-------------------------
//inserting new brand
admin.post('/add-brand',adminAuth.isLogin,upload.single('brandInput'),productController.insertBrand)
//update-brand
admin.post('/edit-brand',adminAuth.isLogin,productController.updateBrandName)

//blocking brand
admin.get('/block-brand',adminAuth.isLogin,productController.blockBrand)
//unblocking brand
admin.get('/unblock-brand',adminAuth.isLogin,productController.unblockBrand)


//---------------------------product-management-------------------

admin.post('/add-product',adminAuth.isLogin,upload.array('images', 3),productController.insertProduct)
//block and unblock product
    admin.get('/block-product',adminAuth.isLogin,productController.blockProduct)















module.exports=admin