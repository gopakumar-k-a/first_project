//=========configuring=express==========
const express = require('express')
const app = express()
const path = require('path')
const session = require('express-session');
require('dotenv').config();
//======================================
//========database=connection=============
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/myJersyDB')
    .then(() => {
        console.log('dataBase connected successfully');
    })
    .catch((err) => {
        console.log('error connecting : ' + err);
    })

//===============================
app.use(express.urlencoded({extended:true}))
// Use the session middleware
app.use(session({
    secret:  process.env.SECRET_KEY, 
    resave: false,
    saveUninitialized: false
    // Additional options can be configured as needed
  }));



// =========router=modules=============
const userRoute = require('./routes/user_routes/userRoute')
const adminRoute = require('./routes/admin_routes/adminRoute')


//======routers============
app.use('/', userRoute)
app.use('/admin', adminRoute)


app.use(express.urlencoded({ extended: true }));


// =============serving static files================
app.use(express.static(path.join(__dirname, 'public')))
app.use('/upload',express.static(path.join('public/admin-assets/uploads')))


//====================view engine======================
app.set('view engine', 'ejs')
app.set('views', './views')





//=======================server=listen=====================
app.listen(3000, () => {
    console.log('server started at 3000')
})


