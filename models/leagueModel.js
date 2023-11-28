const mongoose=require('mongoose')

const leagueSchema=new mongoose.Schema({
    name:{
        typea:String,
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


const league=mongoose.model('league',leagueSchema)
module.exports=league