
const express = require('express')
const app = express()
const path = require('path')
const session = require('express-session');
require('dotenv').config();
const nocache = require('nocache');
const mongoose = require('mongoose')
const {errorHandler}=require('./middleware/errorHandler')
const atlasConnectionString = process.env.ATLAS_CONNECTION_STRING;
const userRoute = require('./routes/user_routes/userRoute')
const adminRoute = require('./routes/admin_routes/adminRoute')
mongoose.connect(atlasConnectionString)
    .then(() => {
        console.log('dataBase connected successfully');
    })
    .catch((err) => {
        console.log('error connecting : ' + err);
    })
    app.use(session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: false
    }));
app.use(nocache());
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use('/',userRoute)
app.use('/admin', adminRoute)
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
app.use('/upload', express.static(path.join('public/admin-assets/uploads')))
app.set('view engine', 'ejs')
app.set('views', './views')
app.use('*',(req,res)=>{
    res.render('error/404')
})
app.use(errorHandler)



app.listen(3000, () => {
    console.log('server started at 3000')
})
