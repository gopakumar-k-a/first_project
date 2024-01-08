
const isLogin=async(req,res,next)=>{
    try {
        // if(req.session.isAdmin)
        // { next()}
        // else{
        //     res.redirect('/admin')
        //     return
        // }     
        next()
        
    } catch (err) {
        console.log(err.message)
    }
}

const isLogout=async(req,res,next)=>{
    try {
    // if(req.session.isAdmin)
    // {
    //     res.redirect('/admin/dashboard');
    // }else{
 
    //     next();
    // }
    next()
        
        
    } catch (err) {
        console.log(err.message)
    }
    
}



module.exports={isLogin,isLogout}