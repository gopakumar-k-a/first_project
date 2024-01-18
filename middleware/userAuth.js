const userModel = require('../models/userModel'); 

const isUserBlock=async(req,res,next)=>{
    try {
        if(req.session.userId){
            const userId=req.session.userId
            const useData=await userModel.findById(userId)
            if(useData.isActive==true){
                next()
            }else{
                req.session.userEmail=null
                req.session.userId=null
               next()
            }
        }else{
            next()
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

const isLogin = async (req, res, next) => {
    try {
        if (req.session.userEmail) {
            next()
        }else{
            res.redirect('/login')

        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Internal Server Error');
    }
};

const isLogout = async (req, res, next) => {
    try {
        if (req.session.userEmail) {
            return res.redirect('/');
        } else {
            next();
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Internal Server Error');
    }
};





module.exports = { isLogin, isLogout,isUserBlock };
