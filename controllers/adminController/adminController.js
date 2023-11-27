//load log in page

const loadLogin=async(req,res)=>{

    try {
    res.render('admin/adminLogin')
    } catch (error) {
       console.log(error.message) 
    }
}
//load dashboard page
const loadDashboard=async(req,res)=>{
try {
    res.render('admin/adminDashboard')
} catch (error) {
    
}
}
//load product list page
const loadProjectList=async(req,res)=>{
    try {
        res.render('admin/productList')
    } catch (error) {
        console.log(error.message);
    }
}

//load add product page

const loadAddProduct=async(req,res)=>{
    try {
        res.render('admin/addProduct')
        
    } catch (error) {
        console.log(error.message);
    }
}

//load category page
const loadCategory=async(req,res)=>{
    try {
        res.render('admin/categoryManagement')
    } catch (error) {
        onsole.log(error.message);
    }
}

module.exports={loadLogin,loadDashboard,loadProjectList,loadAddProduct,
loadCategory}