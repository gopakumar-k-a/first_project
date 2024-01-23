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
    },
    address:[{
        firstName:{
            type:String,
            required:true
        },
        lastName:{
            type:String,
            required:true
        },
        phone:{
            type:Number,
            required:true
        },
        altPhone:{
            type:Number,
            required:true
        },
        houseName:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        pincode:{
            type:Number,
            required:true
        },
        landMark:{
            type:String,
            required:true
        }
    }],
    referralCode: {
        type: String,
    },
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },

})



module.exports=mongoose.model('user',user)