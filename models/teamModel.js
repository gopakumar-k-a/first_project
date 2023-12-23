const mongoose=require('mongoose')

const teamSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
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

const team=mongoose.model('team',teamSchema)
module.exports=team