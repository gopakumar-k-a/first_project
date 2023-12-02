
const userModel = require('../../models/userModel')

const bcrypt = require('bcrypt');

const validator = require("validator");


//load log in page
const loadLogin = async (req, res) => {

    try {
        res.render('admin/adminLogin', { message: '' })
    } catch (error) {
        console.log(error.message)
    }
}
//authenticating admin
const checkAdmin = async (req, res) => {

    try {
        const { email, password } = req.body
        // console.log('this is email '+email);
        // console.log('this is password '+password);

        if (!email || !password) {
            const message = 'all fields must be filled'
            return res.render('admin/adminLogin', { message })
        }

        // console.log(email + ' email')
        const isValidEmail = validator.isEmail(email); //validating email
        console.log(isValidEmail + 'validate result')
        if (!isValidEmail) {
            const message = 'Please enter a valid email';
            return res.render('admin/adminLogin', { message })
        }


        const userMatch = await userModel.findOne({ email: email, isAdmin: true })
        console.log(userMatch + '  this is userData');

        if (userMatch) {
            const PasswordMatch = await bcrypt.compare(password, userMatch.password);

            if (PasswordMatch) {
                return res.render('admin/adminDashboard')

            }
            else {
                const message = 'incorrect password'
                return res.render('admin/adminLogin', { message })
            }

        }
        else {
            const message = 'incorrect email or password'
            return res.render('admin/adminLogin', { message })
        }
    } catch (error) {
        console.log(error.message);
    }

}
//load dashboard page
const loadDashboard = async (req, res) => {
    try {
        res.render('admin/adminDashboard')
    } catch (error) {
        console.log(error.message);
    }
}

//load users list

const loadUsersList = async (req, res) => {
    try {
        const userData=await userModel.find({isAdmin:false}).sort({createdAt:1})
        return res.render('admin/usersList',{userData})
    } catch (error) {
        console.log(error.message);
    }
}

const blockUser=async (req,res)=>{
    try {
        const id=req.query._id
        await userModel.updateOne({_id:id},{$set:{isActive:false}})
        return res.redirect('/admin/edit-users')
    } catch (error) {
        console.log(error.message);
    }
}

const unBlockUser=async (req,res)=>{
    try {
        const id=req.query._id
        await userModel.updateOne({_id:id},{$set:{isActive:true}})
        return res.redirect('/admin/edit-users')
    } catch (error) {
        console.log(error.message);
    }
}




module.exports = {
    loadLogin, loadDashboard, checkAdmin, loadUsersList,blockUser,unBlockUser
}