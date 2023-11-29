
const userModel = require('../../models/userModel')



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

        if (!email || !password) {
            const message = 'all fields must be filled'
            return res.render('admin/adminLogin', { message })
        }

        console.log(email + ' email')
        // const isValidEmail = validator.isEmail(email); //validating email
        // console.log(isValidEmail + 'validate result')
        // if (!isValidEmail) {
        //     const message = 'Please enter a valid email';
        //     return res.render('admin/adminLogin',message)
        // }


        const userMatch = await userModel.findOne({ email: email, isAdmin: true })
        console.log(userMatch + '  this is userData');

        if (userMatch && userMatch.password == password) {
            // const PasswordMatch = await bcrypt.compare(password, userMatch.password);

            // if (PasswordMatch) {
            res.redirect('/admin/dashboard')

            // }
            // else {
            //     const message = 'incorrect password'
            //     return res.render('admin/adminLogin',message)
            // }

        }
        else {
            const message = 'incorrect email or password'
            return res.render('admin/adminLogin', message)
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

    }
}




module.exports = {
    loadLogin, loadDashboard,checkAdmin}