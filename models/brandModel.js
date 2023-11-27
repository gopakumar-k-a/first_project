const mongoose=require('mongoose')

const brandSchema=new mongoose.Schema({
    name:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:true
    }
})

module.exports=mongoose.model('brand',brandSchema)