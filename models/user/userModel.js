const mongoose=require('mongoose')


const user=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
     type:Number,
     required:true
    },
    password:{
        type:String,
        required:true
    }, 
    isAdmin:{
        type:Boolean,
        default:false
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



module.exports=mongoose.model('users',user)