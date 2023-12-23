const mongoose=require('mongoose')

const brandSchema=new mongoose.Schema({
    name:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:true
    },
    imageUrl: {
        type: String,
        required: true
    },
    createdAt:{
        type:Date,
        default: () => Date.now()
    }

})


const brand=mongoose.model('brand',brandSchema)
module.exports=brand