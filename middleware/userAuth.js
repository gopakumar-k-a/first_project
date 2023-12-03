const userModel = require('../models/userModel'); 

const isLogin = async (req, res, next) => {
    try {
        if (req.session.userEmail) {
            const user = await userModel.findOne({ email: req.session.userEmail });
            if (user && user.isActive) {
                next();
            } else {
                req.session.destroy(); 
                res.redirect('/login');
            }
        } else {
            res.redirect('/login');
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

module.exports = { isLogin, isLogout };
