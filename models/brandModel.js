const mongoose=require('mongoose')

const brandSchema=new mongoose.Schema({
    name:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:true
    },
    createdAt:{
        type:Date,
        default: () => Date.now()
    },
    imageUrl: {
        type: String,
        required: true
    },

})


const brand=mongoose.model('brand',brandSchema)
module.exports=brand