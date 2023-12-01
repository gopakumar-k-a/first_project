//requiring user model

const userModel = require('../../models/userModel')

const bcrypt = require('bcrypt');

const validator = require("validator");

const nodemailer = require('nodemailer');

require('dotenv').config(); //required for accessing env variable



//load home page
const loadHome = async (req, res) => {
    try {
        const user = req.session.userEmail || ''
        res.render('user/home', { user })
    } catch (error) {
        console.log(error.message);
    }

}
//load log in page

const loadLogin = async (req, res) => {
    try {
        const user = req.session.userEmail || ''
        const currentEmail = req.session.email || ''
        // destroys email after storing to current email

        const message = req.query.message || ''
        const isLogin = req.session.isLogin || ''
        const sMessage = req.query.sMessage || ''
        res.render('user/login', { currentEmail, message, isLogin, sMessage, user })

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

//load forgot password page

const loadForgotPassword = async (req, res) => {
    try {
        const user = req.session.userEmail || ''
        const email = req.query.currentEmail
        res.render('user/forgotPassword', { user })

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

        const currentEmail = req.session.email
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
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};
//===========================================


//random otp generate function
function generateOTP() {
    // Generate a random number between 100000 (inclusive) and 999999 (exclusive)
    return Math.floor(100000 + Math.random() * 900000).toString();
}

//node mailer function for sending otp to mail
const sendOtp = async (email, otp) => {
    try {



        console.log('generated OTP' + otp)

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'OTP For your verification',
            html: `<h style="color: blue;">Enter this OTP to register on jersy man</h>
            <p>Your OTP is: <strong>${otp}</strong></p>`
        };

        transporter.sendMail(mailOptions)
            .then((info) => {
                console.log('Email sent:', info.response);
            })
            .catch((error) => {
                console.error('Error sending email:', error.message);
            });
    } catch (error) {
        console.log(error.message);
    }
}
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
                console.log(req.session + '  this is generated session');

                // const currentEmail = email
                await sendOtp(email, otp)


                return res.render('user/otp', { user, email: '', errMessage: '' })

            }

        }
    }
    catch (error) {
        console.log(error.message)
    }
}

const resendOtp = async (req, res) => {
    try {
        const user = req.session.userEmail || ''
        const email = req.session.email;
        const otp = generateOTP();
        req.session.otp = otp;
        console.log('resend generated OTP'+otp);

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

        if (!email || !password) {
            const message = 'all fields must be filled'
            return res.redirect(`/login?message=${message}`)
        }

        console.log(email + ' email')
        const isValidEmail = validator.isEmail(email); //validating email
        console.log(isValidEmail + 'validate result')
        if (!isValidEmail) {
            const message = 'Please enter a valid email';
            return res.redirect(`/login?message=${message}`)
        }


        const userMatch = await userModel.findOne({ email: email, isAdmin: false })

        if (userMatch) {
            const PasswordMatch = await bcrypt.compare(password, userMatch.password);

            if (PasswordMatch) {
                const message = 'log in success'
                req.session.userEmail = userMatch.email
                return res.redirect(`/?message=${message}`)

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





//================================================

module.exports = {
    loadHome, loadLogin, loadRegister, loadAbout, loadContact,
    loadForgotPassword, registerUser, checkuser, loadOtp, checkOtp, logout,
    resendOtp
}