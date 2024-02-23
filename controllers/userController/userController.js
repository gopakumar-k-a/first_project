const userModel = require('../../models/userModel')
const productModel = require('../../models/productModel')
const orderModel = require('../../models/orderModel')
const brandModel = require('../../models/brandModel')
const bcrypt = require('bcryptjs');
const hashPassword = require('../../utility/hashPassword')
const validator = require("validator");
const { generateOTP, sendOtp, contactUsMailSender } = require('../../utility/nodeMailer');
const walletModel = require('../../models/walletModel');
const bannerModel = require('../../models/bannerModel');
require('dotenv').config();
const { generateReferralCode, checkReferredUser } = require('../../helper/referralCode')

//load home page
const loadHome = async (req, res, next) => {
    try {
        const user = req.session.userEmail || ''
        const bannerData = await bannerModel.find()

        const prData = await productModel.find({
            isActive: true,
            catStatus: true,
            leagueStatus: true,
            brandStatus: true
        }).populate('brand').populate('category').sort({ createdAt: -1 }).limit(6)
        const brandData = await brandModel.find()
        res.render('user/home', { user, prData, bannerData, brandData })
    } catch (error) {
        console.log(error.message);
        next(error)
    }

}
//load login page
const loadLogin = async (req, res, next) => {
    try {
        const user = req.session.userEmail || ''
        const email = req.session.lEmail || ''
        delete req.session.lEmail;
        const message = req.query.message || ''
        const isLogin = req.session.isLogin || ''
        const sMessage = req.query.sMessage || ''
        res.render('user/login', { message, isLogin, sMessage, user, email })

    } catch (error) {
        console.log(error.message)
        next(error)

    }
}

//log out operation
const logout = async (req, res, next) => {
    try {
        await req.session.destroy()
        res.redirect('/login')
    } catch (error) {
        console.log(error.message)
        next(error)

    }
}
//load regiseter page
const loadRegister = async (req, res, next) => {
    try {
        const user = req.session.userEmail || ''
        const message = req.query.message || ''
        if (req.session.forgotOtp) {
            req.session.forgotOtp = null
        }
        res.render('user/register', { message, user })
    } catch (error) {
        console.log(error.message)
        next(error)

    }
}
//load forgot to password page
const loadForgotPassword = async (req, res, next) => {
    try {
        if (req.session.registerOtp) {
            req.session.registerOtp = null
        }
        const user = req.session.userEmail || ''
        return res.render('user/forgotPassword', { user, message: '', otpCheck: '' })
    } catch (error) {
        console.log(error.message);
        next(error)

    }
}
//load about page
const loadAbout = async (req, res, next) => {
    try {
        const user = req.session.userEmail || ''
        const bannerData = await bannerModel.find()

        res.render('user/about', { user, bannerData })
    } catch (error) {
        console.log(error.message)
        next(error)

    }
}
//load contact page
const loadContact = async (req, res, next) => {
    try {
        const message = req.query.message || ''
        console.log('message ', message);
        const user = req.session.userEmail || ''
        res.render('user/contact', { user, message })
    } catch (error) {
        console.log(error.message)
        next(error)

    }
}
//load otp page
const loadOtp = async (req, res, next) => {
    try {
        const user = req.session.userEmail || ''
        const errMessage = req.query.errMessage || ''
        const email = req.session.email || ''
        res.render('user/otp', { email, errMessage, user })
    } catch (error) {
        console.log(error.message);
        next(error)
    }
}
//otp in forgot password
const sendForgotOtp = async (req, res, next) => {
    try {
        const { email } = req.body
        const matchUser = await userModel.findOne({ email: email })
        if (!matchUser) {
            res.status(400).json({ message: 'user Not Found !' })
        } else {
            req.session.forgotOtp = true
            const otp = generateOTP()
            req.session.FOtp = otp
            req.session.FEmail = email
            await sendOtp(email, otp)
            res.status(200).json({ message: 'An Otp is send to Your Email' })
        }
    } catch (error) {
        console.log(error.message);
        next(error)
    }
}

//validating otp from user
const checkOtp = async (req, res, next) => {
    try {
        const user = req.session.userEmail || ''
        const otpFromPage = req.body.otp
        if (!req.body.otp) {
            const errMessage = 'all fields must be filled'
            return res.render('user/otp', { errMessage, email: '', user })
        }

        if (req.session.registerOtp != null) {
            if (req.session.ROtp != otpFromPage) {
                const errMessage = 'incorrect OTP'
                return res.render('user/otp', { errMessage, email: '', user })
            }


            if (req.session.ROtp == otpFromPage) {

                const referralCode = await generateReferralCode()
                let referredBy = null
                if (req.session.referralCode != null) {
                    const referringUser = await checkReferredUser(req.session.referralCode);
                    if (referringUser) {
                        referredBy = referringUser._id;
                    }
                }
                const data = new userModel({
                    name: req.session.fullname,
                    email: req.session.email,
                    phone: req.session.phoneno,
                    password: req.session.password,
                    referralCode: referralCode,
                    referredBy: referredBy
                })
                await data.save()
                const newUserId = data._id;



                if (referredBy != null) {
                    const walletData = await walletModel.findOne({ userId: referredBy })
                    const historyData = {
                        amount: 50,
                        type: 'credit'
                    }
                    if (walletData) {
                        walletData.balance += 50
                        walletData.history.push(historyData)
                        await walletData.save()
                    } else {
                        const createWallet = new walletModel({
                            userId: referredBy,
                            balance: 50,
                            history: historyData

                        })
                        await createWallet.save()
                    }
                    const newUserHistory = {
                        amount: 100,
                        type: 'credit'
                    }
                    const newUserWallet = new walletModel({
                        userId: newUserId,
                        balance: 100,
                        history: newUserHistory
                    })

                    await newUserWallet.save()


                } else {
                    const defaultWallet = new walletModel({
                        userId: newUserId,
                        balance: 0
                    })

                    await defaultWallet.save()
                }



                delete req.session.fullname;
                delete req.session.email;
                delete req.session.phoneno;
                delete req.session.password;
                delete req.session.ROtp;
                delete req.session.registerOtp
                delete req.session.referralCode

                const sMessage = 'Registration Successfull'
                return res.redirect(`/login?sMessage=${encodeURIComponent(sMessage)}`);

            }

        }

        if (req.session.forgotOtp != null) {
            if (req.session.FOtp != otpFromPage) {
                const errMessage = 'incorrect OTP'
                return res.render('user/otp', { errMessage, email: '', user })
            }
            if (req.session.FOtp == otpFromPage) {
                res.render('user/forgotPassword', { user, message: '', otpCheck: 'success' })
            }
        }


    } catch (error) {
        console.log(error.message);
        next(error)
    }

}
//updating password of the user from forgot otp
const changePassword = async (req, res, next) => {
    try {
        const userPass = req.body.password
        const forgotPassEmail = req.session.FEmail
        const hashedPass = await hashPassword(userPass)
        const userData = await userModel.findOneAndUpdate({ email: forgotPassEmail }, { password: hashedPass })
        delete req.session.ROtp
        if (userData) {
            res.status(200).json({ message: 'success' })
        }

    } catch (error) {
        console.log(error.message);
        next(error)
    }
}
//registering new user
const registerUser = async (req, res, next) => {
    try {
        const firstname = req.body.firstName
        const lastname = req.body.lastName
        const email = req.body.email
        const phoneno = req.body.phoneno
        const user = req.session.userEmail || ''
        const userPass = req.body.password
        const referralCode = req.body.referralCode.toUpperCase()

        const userMatch = await userModel.find({ email: email }) 
        const phoneMatch = await userModel.find({ phone: phoneno })
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
            req.session.referralCode = referralCode
            const otp = generateOTP()
            req.session.ROtp = otp
            await sendOtp(email, otp)
            req.session.registerOtp = true

            // return res.redirect('/otp')
            return res.render('user/otp', { errMessage: '', email: '', user })


        }


    }
    catch (error) {
        console.log(error.message)
        next(error)
    }
}
//resend otp functionality
const resendOtp = async (req, res, next) => {
    try {
        const user = req.session.userEmail || ''
        const otp = generateOTP();
        if (req.session.registerOtp) {
            const email = req.session.email;
            req.session.ROtp = otp;
            await sendOtp(email, otp);
        }
        if (req.session.forgotOtp) {
            const FEmail = req.session.FEmail
            req.session.FOtp = otp
            await sendOtp(FEmail, otp)
        }




        res.render('user/otp', { user, email: user, errMessage: '' });
    } catch (error) {
        console.log(error.message);
        next(error)
    }
}
//checking user before log in
const checkuser = async (req, res, next) => {

    try {
        const { email, password } = req.body
        req.session.lEmail = email
        if (!email || !password) {
            const message = 'all fields must be filled'
            return res.redirect(`/login?message=${message}`)
        }
        const isValidEmail = validator.isEmail(email);
        if (!isValidEmail) {
            const message = 'Please enter a valid email';
            return res.redirect(`/login?message=${message}&email=${email}`)
        }
        const userMatch = await userModel.findOne({ email: email, isAdmin: false })
        if (userMatch) {
            if (userMatch.isActive == true) {
                const passwordMatch = await bcrypt.compare(password, userMatch.password);
                if (passwordMatch) {
                    req.session.userEmail = userMatch.email;
                    req.session.userId = userMatch._id;
                    return res.redirect('/');
                } else {
                    return res.redirect(`/login?message=incorrect password`);
                }
            }
            else if (userMatch.isActive == false) {
                return res.redirect(`/login?message=Cannot Login You are Blocked by the Admin`);
            }
        } else {
            return res.redirect(`/login?message=incorrect email or password`);
        }
    } catch (error) {
        console.log(error.message);
        next(error)
    }

}
//load user dashboard
const loadUserDashboard = async (req, res, next) => {
    try {
        const userId = req.session.userId
        const user = req.session.userEmail || ''
        const goto = req.query.goto || ''
        const userData = await userModel.findOne({ email: user }) || ''
        const message = req.query.message
        const sMessage = req.query.sMessage || ''

        const fullName = userData.name.split(' ');
        const firstName = fullName[0]
        const lastName = fullName[1]
        const page = req.query.page || 1
        const limit = 10
        const skip = (page - 1) * limit


        if (goto == 'account overview') {
            return res.render('user/userDashboard', { user, userData, firstName, lastName, message: message, sMessage: sMessage })
        }
        if (goto == 'user address') {
            return res.render('user/userAddress', { user, userData, message: message, sMessage: sMessage })
        }
        if (goto == 'user orders') {
            const orderData = await orderModel.find({ userId: userId }).populate('items.productId').sort({ orderedAt: -1 }).skip(skip).limit(limit)
            const orderCount = await orderModel.countDocuments({ userId: userId });



            return res.render('user/userOrders', {
                user,
                userData,
                message: message,
                sMessage: sMessage,
                orderData,
                pageCount: Math.ceil(orderCount / limit),
                currentPage: page
            })
        }
        if (goto == 'user wallet') {
            const walletData = await walletModel.findOne({ userId: userId }).sort({ 'history.createdAt': -1 }).skip(skip).limit(limit);
            // const walletCount = await walletModel.countDocuments({ userId: userId });


            return res.render('user/userWallet', {
                user,
                userData,
                walletData,
            })
        }
    } catch (error) {
        console.log(error.message);
        next(error)
    }
}
//user data update through user dashboard
const userUpdate = async (req, res, next) => {
    try {

        const goto = req.query.goto
        const id = req.query._id
        if (goto == 'password update') {
            const currentPassword = req.body.currentPassword
            const newPassword = req.body.newPassword
            const userMatch = await userModel.findOne({ _id: id })
            if (userMatch) {
                const PasswordMatch = await bcrypt.compare(currentPassword, userMatch.password);
                if (PasswordMatch) {
                    const hashedPass = await hashPassword(newPassword)
                    console.log('this is hashed Pass' + hashedPass);
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
        if (goto == 'user update') {
            const firstname = req.body.firstname
            const lastname = req.body.lastname
            const email = req.body.email
            const phoneno = req.body.phoneno

            if (!firstname || !lastname || !email || !phoneno) {
                const message = 'All fields must be filled';
                console.log('All fields must be filled');
                return res.redirect(`/user-dashboard?goto=account+overview&message=${encodeURIComponent(message)}`);
            } else {
                const phoneMatch = await userModel.find({ phone: phoneno }).countDocuments();

                if (phoneMatch > 1) {
                    const message = 'Phone number already exists';
                    return res.redirect(`/user-dashboard?goto=account+overview&message=${encodeURIComponent(message)}`);
                } else {
                    const fullName = firstname + ' ' + lastname
                    await userModel.updateOne({ _id: id }, {
                        $set: {
                            name: fullName,
                            phone: phoneno
                        }
                    })
                    const sMessage = 'credentials updated';
                    return res.redirect(`/user-dashboard?goto=account+overview&sMessage=${encodeURIComponent(sMessage)}`);
                }
            }




        }

    } catch (error) {
        console.log(error.message);
        next(error)
    }
}

const contactUsMessage = async (req, res, next) => {
    try {
        const { customerName, customerEmail, contactSubject, contactMessage } = req.body
        console.log(req.body);
        const sendMail = await contactUsMailSender(customerName, customerEmail, contactSubject, contactMessage)

        const message = 'email send successfully'
        return res.redirect(`/contact?message=${message}`)






    } catch (error) {
        console.log(error.message);
        next(error)
    }
}



module.exports = {
    loadHome, loadLogin, loadRegister, loadAbout, loadContact,
    registerUser, checkuser, loadOtp, checkOtp, logout,
    resendOtp, loadUserDashboard, userUpdate, loadForgotPassword,
    sendForgotOtp, changePassword, contactUsMessage
}