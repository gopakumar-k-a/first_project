
const userModel = require('../../models/userModel')
const bcrypt = require('bcrypt');
const validator = require("validator");


const loadLogin = async (req, res) => {

    try {
        res.render('admin/adminLogin', { message: '' })
    } catch (error) {
        console.log(error.message)
    }
}

const logout = async (req, res) => {
    try {
        req.session.destroy()
        return res.redirect('/admin')
    } catch (error) {
        console.log(error.message);
    }
}

const checkAdmin = async (req, res) => {

    try {
        const { email, password } = req.body
        if (!email || !password) {
            const message = 'all fields must be filled'
            return res.render('admin/adminLogin', { message })
        }
        const isValidEmail = validator.isEmail(email);
        if (!isValidEmail) {
            const message = 'Please enter a valid email';
            return res.render('admin/adminLogin', { message })
        }


        const userMatch = await userModel.findOne({ email: email, isAdmin: true })

        if (userMatch.isAdmin == true) {
            const PasswordMatch = await bcrypt.compare(password, userMatch.password);

            if (PasswordMatch) {
                req.session.isAdmin = email
                return res.render('admin/adminDashboard')

            }
            else {
                const message = 'incorrect password'
                return res.render('admin/adminLogin', { message })
            }

        } else {
            const message = 'incorrect email or password'
            return res.render('admin/adminLogin', { message })
        }
    } catch (error) {
        console.log(error.message);
    }

}

const loadDashboard = async (req, res) => {
    try {
        res.render('admin/adminDashboard')
    } catch (error) {
        console.log(error.message);
    }
}

const loadUsersList = async (req, res) => {
    try {
        const page = req.query.page || 1
        const count = await userModel.find().count()
        const limit = 5
        const skip = (page - 1) * limit
        const userData = await userModel.find({ isAdmin: false }).sort({ createdAt: -1 }).
            limit(limit).skip(skip)
        const userIndices = userData.map((user, index) => index + 1 + skip);
        return res.render('admin/usersList', {
            userData: userData,
            userIndices: userIndices,
            pageCount: Math.ceil(count / limit),
            currentPage: page,
            limit: limit

        })
    } catch (error) {
        console.log(error.message);
    }
}

const blockUser = async (req, res) => {
    try {
        const id = req.query._id
        await userModel.updateOne({ _id: id }, { $set: { isActive: false } })
        res.status(200).json({ message: 'success' })
    } catch (error) {
        console.log(error.message);
    }
}

const unBlockUser = async (req, res) => {
    try {
        const id = req.query._id
        await userModel.updateOne({ _id: id }, { $set: { isActive: true } })
        res.status(200).json({ message: 'success' })
    } catch (error) {
        console.log(error.message);
    }
}




module.exports = {
    loadLogin, loadDashboard, checkAdmin, loadUsersList, blockUser,
    unBlockUser, logout
}