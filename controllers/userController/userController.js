//requiring user model

const userModel = require('../../models/user/userModel')

const bcrypt = require('bcrypt');



//load home page
const loadHome = async (req, res) => {
    try {
        res.render('user/home')
    } catch (error) {
        console.log(error.message);
    }

}
//load log in page

const loadLogin = async (req, res) => {
    try {
        const currentEmail = req.query.currentEmail || '' // Get the email from the query parameters
        const message=req.query.message || ''
        res.render('user/login', { currentEmail,message})
    } catch (error) {
        console.log(error.message)
    }
}


//load register page

const loadRegister = async (req, res) => {
    try {
        const message = req.query.message || ''
        res.render('user/register', { message })
    } catch (error) {
        console.log(error.message)
    }
}

//load about page
const loadAbout = async (req, res) => {
    try {
        res.render('user/about')
    } catch (error) {
        console.log(error.message)
    }
}

//load contact us page

const loadContact = async (req, res) => {
    try {
        res.render('user/contact')
    } catch (error) {
        console.log(error.message)
    }
}

//load forgot password page

const loadForgotPassword = async (req, res) => {
    try {
        res.render('user/forgotPassword')

    } catch (error) {
        console.log(error.message)

    }
}


//hashing function
// Hash the user's password before saving to the database
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};
//===========================================
//register user on the server
const registerUser = async (req, res) => {
    try {
        const user = req.body
        const firstname = user.firstname
        const lastname = user.lastname
        const email = user.email
        const phoneno = user.phoneno
        const password = user.password
        const cpassword = user.cpassword


        if (!firstname || !lastname || !email || !phoneno || !password || !cpassword) {
            const message = 'All fields must be filled';
            return res.redirect(`/register?message=${encodeURIComponent(message)}`);
        }
        else if (cpassword != password) {
            const message = 'password is not matching'
            console.log(user)
            return res.redirect(`/register?message=${encodeURIComponent(message)}`);
        }
        else {
            const userPass = req.body.password

            const userMatch = await userModel.find({ email: email })
            console.log(userMatch.email + 'this is matched mail')


            if (userMatch.length > 0) {
                const message = 'email already exists'
                return res.redirect(`/register?message=${encodeURIComponent(message)}`);
            }
            else {
                const hashedPass = await hashPassword(userPass)
                const fullname = firstname + ' ' + lastname
                console.log(hashedPass + 'this is hashed password')
                const data = new userModel({
                    name: fullname,
                    email: email,
                    phone: phoneno,
                    password: hashedPass
                })
                await data.save()
                const currentEmail=email
                return res.redirect(`/login?currentEmail=${encodeURIComponent(currentEmail)}`);

            }

        }
    }
    catch (error) {
        console.log(error.message)
    }
}
//====================================
//user login post authentication
const checkuser=async(req,res)=>{

    try {
        const {email,password}=req.body

        if( !email || !password){
            const message='all fields must be filled'
                res.redirect(`/login?message=${encodeURIComponent(message)}`)
        }
        else{

 
      const userMatch=await userModel.find({email:email})
      if(userMatch){
          if(userMatch.email==email && userMatch.password==password){
              const message='log in success'
              res.redirect(`/login?message=${message}`)
          }
          else if(userMatch.email==email && userMatch.password!=password){
              const message='incorrect password'
              res.redirect(`/login?message=${encodeURIComponent(message)}`)
          }
      
      }
      else{
          const message='incorrect email'
          res.redirect(`/login?message=${encodeURIComponent(message)}`)
      }


        }
    
  
        
    } catch (error) {
       console.log(error.message); 
    }

}



//================================================

module.exports = {
    loadHome, loadLogin, loadRegister, loadAbout, loadContact,
    loadForgotPassword, registerUser,checkuser
}