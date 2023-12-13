// user model
const userModel = require('../../models/userModel')
//product model
const productModel = require('../../models/productModel')

const bcrypt = require('bcrypt');

const validator = require("validator");

const {generateOTP,sendOtp} = require('../../utility/nodeMailer');

require('dotenv').config(); //required for accessing env variable



//load home page
const loadHome = async (req, res) => {
    try {
        const user = req.session.userEmail || ''

        const prData = await productModel.find({ isActive: true }).populate('brand')
        res.render('user/home', { user, prData })
    } catch (error) {
        console.log(error.message);
    }

}
//load log in page

const loadLogin = async (req, res) => {
    try {
        const user = req.session.userEmail || ''
        const email = req.session.lEmail || ''
        delete req.session.lEmail;
        // destroys email after storing to email

        const message = req.query.message || ''
        const isLogin = req.session.isLogin || ''
        const sMessage = req.query.sMessage || ''
        res.render('user/login', { message, isLogin, sMessage, user, email })

    } catch (error) {
        console.log(error.message)
    }
}

//log out

const logout = async (req, res) => {
    try {
        await req.session.destroy()
        res.redirect('/login')
    } catch (error) {
        console.log(error.message)
    }
}


//load register page

const loadRegister = async (req, res) => {
    try {
        const user = req.session.userEmail || ''
        const message = req.query.message || ''
        res.render('user/register', { message, user })
    } catch (error) {
        console.log(error.message)
    }
}

//load about page
const loadAbout = async (req, res) => {
    try {
        const user = req.session.userEmail || ''
        res.render('user/about', { user })
    } catch (error) {
        console.log(error.message)
    }
}

//load contact us page

const loadContact = async (req, res) => {
    try {
        const user = req.session.userEmail || ''
        res.render('user/contact', { user })
    } catch (error) {
        console.log(error.message)
    }
}



//load otp page
const loadOtp = async (req, res) => {
    try {
        const user = req.session.userEmail || ''
        const errMessage = req.query.errMessage || ''
        const email = req.session.email || ''
        res.render('user/otp', { email, errMessage, user })


    } catch (error) {
        console.log(error.message);
    }
}

//checking otp

const checkOtp = async (req, res) => {
    const user = req.session.userEmail || ''
    if (!req.body.otp) {
        const errMessage = 'all fields must be filled'
        return res.render('user/otp', { errMessage, email: '', user })
    }
    if (req.session.otp == req.body.otp) {


        const data = new userModel({
            name: req.session.fullname,
            email: req.session.email,
            phone: req.session.phoneno,
            password: req.session.password
        })
        await data.save()
        delete req.session.fullname;
        delete req.session.email;
        delete req.session.phoneno;
        delete req.session.password;
        delete req.session.otp;

        const sMessage = 'Registration Successfull'
        return res.redirect(`/login?sMessage=${encodeURIComponent(sMessage)}`);

    }
    else {
        const errMessage = 'incorrect OTP'
        return res.render('user/otp', { errMessage, email: '', user })
    }
}


//hashing function
// Hash the user's password before saving to the database
const hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        console.log(error.message);

    }

};
//===========================================



//register user on the server
const registerUser = async (req, res) => {
    try {

        const firstname = req.body.firstname
        const lastname = req.body.lastname
        const email = req.body.email
        const phoneno = req.body.phoneno
        const password = req.body.password
        const cpassword = req.body.cpassword
        const user = req.session.userEmail || ''

        if (!firstname || !lastname || !email || !phoneno || !password || !cpassword) {
            const message = 'All fields must be filled';
            return res.render(`user/register`, { message, user });
        }
        else if (cpassword != password) {
            const message = 'password is not matching'
            console.log(user)
            return res.render(`user/register`, { message, user });
        }
        else {
            const userPass = req.body.password

            const userMatch = await userModel.find({ email: email })
            const phoneMatch = await userModel.find({ phone: phoneno })
            console.log(userMatch.email + 'this is matched mail')


            if (userMatch.length > 0) {
                const message = 'email already exists'
                return res.render(`user/register`, { message, user });
            }
            else if (phoneMatch.length > 0) {
                return res.render(`user/register`, { message: 'phone no already in use', user });
            }
            else {
                const hashedPass = await hashPassword(userPass)
                const fullname = firstname + ' ' + lastname



                req.session.fullname = fullname
                req.session.email = email
                req.session.phoneno = phoneno
                req.session.password = hashedPass



                const otp = generateOTP()
                req.session.otp = otp
                await sendOtp(email, otp)



                console.log(req.session + '  this is generated session');

                // const currentEmail = email



                return res.redirect('/otp')

            }

        }
    }
    catch (error) {
        console.log(error.message)
    }
}
//resend OTP
const resendOtp = async (req, res) => {
    try {
        const user = req.session.userEmail || ''
        const email = req.session.email;
        const otp = generateOTP();
        req.session.otp = otp;
        console.log('resend generated OTP' + otp);

        await sendOtp(email, otp);

        res.render('user/otp', { user, email: email, errMessage: '' });
    } catch (error) {
        console.log(error.message);
    }
}
//====================================
//user login post authentication
const checkuser = async (req, res) => {

    try {
        const { email, password } = req.body
        req.session.lEmail = email


        if (!email || !password) {
            const message = 'all fields must be filled'
            return res.redirect(`/login?message=${message}`)
        }

        console.log(email + ' email')
        const isValidEmail = validator.isEmail(email); //validating email
        console.log(isValidEmail + 'validate result')
        if (!isValidEmail) {
            const message = 'Please enter a valid email';
            return res.redirect(`/login?message=${message}&email=${email}`)
        }


        const userMatch = await userModel.findOne({ email: email, isAdmin: false })
     

        if (userMatch) {
            const PasswordMatch = await bcrypt.compare(password, userMatch.password);

            if (PasswordMatch) {
                req.session.userEmail = userMatch.email
                req.session.userId=userMatch._id
                return res.redirect('/')

            }
            else {
                const message = 'incorrect password'
                return res.redirect(`/login?message=${message}`)
            }

        }
        else {
            const message = 'incorrect email or password'
            return res.redirect(`/login?message=${message}`)
        }
    } catch (error) {
        console.log(error.message);
    }

}

//loading user dashboard pages
const loadUserDashboard = async (req, res) => {
    try {
        const user = req.session.userEmail || ''
        const goto = req.query.goto || ''
        const userData = await userModel.findOne({ email: user }) || ''
        const message = req.query.message
        const sMessage = req.query.sMessage || ''

        const fullName = userData.name.split(' ');
        const firstName = fullName[0]
        const lastName = fullName[1]
        console.log(userData);

        if (goto == 'account overview') {
           return res.render('user/userDashboard', { user, userData,firstName,lastName, message: message, sMessage: sMessage })
        }
        if(goto== 'user address'){
         return res.render('user/userAddress',{user,userData, message: message, sMessage: sMessage})
        }
    } catch (error) {
        console.log(error.message);
    }
}
//user credential update
const userUpdate = async (req, res) => {
    try {

        const goto = req.query.goto
        const id = req.query._id
        console.log('this is ' + goto);
        //updating password
        if (goto == 'password update') {
            const currentPassword = req.body.currentPassword
            const newPassword = req.body.newPassword
            const userMatch = await userModel.findOne({ _id: id })
            if (userMatch) {
                const PasswordMatch = await bcrypt.compare(currentPassword, userMatch.password);
                if (PasswordMatch) {
                    const hashedPass = await hashPassword(newPassword)
                    console.log('this is hashed Pass'+hashedPass);
                    await userModel.updateOne({ _id: id }, { $set: { password: hashedPass } })
                    const sMessage = 'Password updated succesfully'
                    return res.redirect(`/user-dashboard?goto=account+overview&sMessage=${encodeURIComponent(sMessage)}`);

                } else {
                    const message = 'wrong password'
                    return res.redirect(`/user-dashboard?goto=account+overview&message=${encodeURIComponent(message)}`);

                }
            } else {
                res.send('user not found internal server error')
            }



        }
        //updating name,and phone number
        if (goto == 'user update') {
            const firstname = req.body.firstname
            const lastname = req.body.lastname
            const email = req.body.email
            const phoneno = req.body.phoneno
            console.log('first name  ', firstname);
            console.log('last name  ', lastname);
            console.log('email ', email);
            console.log('phone ', phoneno);


            if (!firstname || !lastname || !email || !phoneno) {
                const message = 'All fields must be filled';
                console.log('All fields must be filled');
                return res.redirect(`/user-dashboard?goto=account+overview&message=${encodeURIComponent(message)}`);
            }else {
                const phoneMatch = await userModel.find({ phone: phoneno }).countDocuments();

                if (phoneMatch > 1) {
                    const message = 'Phone number already exists';
                    return res.redirect(`/user-dashboard?goto=account+overview&message=${encodeURIComponent(message)}`);
                } else {
                  const fullName=firstname+' '+lastname
                    await userModel.updateOne({_id:id},{$set:{name:fullName,
                        phone:phoneno}})
                    const sMessage = 'credentials updated';
                    return res.redirect(`/user-dashboard?goto=account+overview&sMessage=${encodeURIComponent(sMessage)}`);
                }
            }




        }

    } catch (error) {
        console.log(error.message);
    }
}









//================================================

module.exports = {
    loadHome, loadLogin, loadRegister, loadAbout, loadContact,
    registerUser, checkuser, loadOtp, checkOtp, logout,
    resendOtp, loadUserDashboard, userUpdate
}