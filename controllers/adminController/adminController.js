const loadLogin=async(req,res)=>{
    try {
    res.render('admin/adminLogin')
    } catch (error) {
       console.log(error.message) 
    }
}
const loadDashboard=async(req,res)=>{
try {
    res.render('admin/adminDashboard')
} catch (error) {
    
}
}

module.exports={loadLogin,loadDashboard}