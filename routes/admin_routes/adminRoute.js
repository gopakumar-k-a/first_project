const express = require('express')
const admin = express()


require('dotenv').config();

const adminController = require('../../controllers/adminController/adminController')

const productController = require('../../controllers/adminController/productController')

const orderController=require('../../controllers/adminController/orderController')

const couponController=require('../../controllers/adminController/couponController')
//requiring storage engine for multer
const upload = require('../../multer')
//admin auth
const adminAuth = require('../../middleware/adminAuth')





//load login page page
admin.get('/', adminAuth.isLogout, adminController.loadLogin)
//load dashboard(dummy content)
admin.post('/', adminController.checkAdmin)
//logout
admin.get('/logout', adminAuth.isLogin, adminController.logout)
//load dashboard page
admin.get('/dashboard', adminAuth.isLogin, adminAuth.isLogin, adminController.loadDashboard)
//load users list
admin.get('/edit-users', adminAuth.isLogin, adminController.loadUsersList)
//block user
admin.patch('/block-user', adminAuth.isLogin, adminController.blockUser)
//unblock user
admin.patch('/unblock-user', adminAuth.isLogin, adminController.unBlockUser)




//load projectlist page
admin.get('/product-list', adminAuth.isLogin, productController.loadProjectList)
//load addproduct page
admin.get('/add-product', adminAuth.isLogin, productController.loadAddProduct)
admin.get('/edit-product', adminAuth.isLogin, productController.loadEditProduct)
admin.post('/add-product', adminAuth.isLogin, upload.array('images', 3), productController.insertProduct)
//block and unblock product
admin.get('/block-product', adminAuth.isLogin, productController.blockProduct)
//edit product
admin.post('/edit-product',adminAuth.isLogin,upload.array('newimages',3),productController.editProduct)
//deleting images 
admin.delete('/edit-product',adminAuth.isLogin,productController.deleteImage)
//===========product management====================

//load product management page
admin.get('/category-management', adminAuth.isLogin, productController.loadCategory)
// category management=========================


// ------category--management--------------
//inserting new category
admin.post('/add-category', adminAuth.isLogin, productController.addCategory)
//updating data of category
admin.post('/edit-cat', adminAuth.isLogin, productController.updateCatName)
//blocking categories
admin.get('/blockCategory', adminAuth.isLogin, productController.blockCat)
//unblocking categories
admin.get('/unblockCategory', adminAuth.isLogin, productController.unblockCat)

//----------------------league-management--------------
//inserting data of league
admin.post('/add-league', adminAuth.isLogin, productController.insertLeague)
//updating data of league
admin.post('/edit-league', productController.updateLeagueName)
//blocking leagues
admin.get('/blockLeague', adminAuth.isLogin, productController.blockLeague)
//unblocking leagues
admin.get('/unblockLeague', adminAuth.isLogin, productController.unblockLeague)


//------------------------team-management---------------------------
//inserting  data of team
admin.post('/add-team', adminAuth.isLogin, productController.insertTeam)
//updating data of team
admin.post('/edit-team', adminAuth.isLogin, productController.updateTeamName)
//blocking team
// admin.get('/blockTeam',productController.blockTeam)
// //unblocking team
// admin.get('/unblockTeam',productController.unblockTeam)


//-----------------------brand-management-------------------------
//inserting new brand
admin.post('/add-brand', adminAuth.isLogin, upload.single('brandInput'), productController.insertBrand)
//update-brand
admin.post('/edit-brand', adminAuth.isLogin, productController.updateBrandName)

//blocking brand
admin.get('/block-brand', adminAuth.isLogin, productController.blockBrand)
//unblocking brand
admin.get('/unblock-brand', adminAuth.isLogin, productController.unblockBrand)
//load user order details
admin.post('/order-details',adminAuth.isLogin,orderController.loadOrderDetails)
//change order Status
admin.patch('/change-order-status',adminAuth.isLogin,orderController.changeOrderStatus)
//all order list 
admin.get('/all-orders',adminAuth.isLogin,orderController.loadAllOrders)
//show single order details
admin.get('/single-order-details',adminAuth.isLogin,orderController.loadSingleOrderDetails)
//load sales report
admin.get('/salesreport',adminAuth.isLogin,adminController.loadSalesReport)
//laading date of sales report
admin.post('/dateofsalesreport',adminAuth.isLogin,adminController.dateOfSalesReport)
//load coupon management page
admin.get('/coupon',adminAuth.isLogin,couponController.loadCoupon)
//add new coupon
admin.post('/coupon',adminAuth.isLogin,couponController.addNewCoupon)
//edit coupon
admin.patch('/coupon',adminAuth.isLogin,couponController.editCoupon)
//change status of the coupon
admin.patch('/coupon-status',adminAuth.isLogin,couponController.changeActive)


















module.exports = admin