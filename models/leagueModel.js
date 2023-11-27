const mongoose=require('mongoose')

const leagueSchema=new mongoose.Schema({
    name:{
        typea:String,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true
    }
})

module.exports=mongoose.model('league',leagueSchema)