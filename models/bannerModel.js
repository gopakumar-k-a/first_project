const mongoose = require('mongoose')


const bannerSchema = new mongoose.Schema({
    name: {
        type: String
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    subtitle: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    imageUrl: {
        type: String,
    },
    startDate: {
        type: Date
    },
    endDate:{
        type:Date
    },
    targetUrl:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:true
    }

})

module.exports=mongoose.model('banner',bannerSchema)