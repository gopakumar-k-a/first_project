const mongoose=require('mongoose')

const teamSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true
    }
})
module.exports=mongoose.Model('team',teamSchema)