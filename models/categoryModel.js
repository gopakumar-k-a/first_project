const mongoose=require('mongoose')

const categorySchema=new mongoose.Schema({
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
    }


})


const category=mongoose.model('category',categorySchema)
module.exports=category
