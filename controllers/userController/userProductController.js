const productModel=require('../../models/productModel')

//load single product
const loadSingleProduct=async(req,res)=>{
    try {
        const user = req.session.userEmail || ''
        const id=req.query._id
        const product=await productModel.findOne({_id:id}).populate('brand').populate('category').populate('team').populate('league')
        return res.render('user/singleProduct',{user,product})
    } catch (error) {
        console.log(error.message);
    }
}
const loadShop=async(req,res)=>{
    try {
        const user = req.session.userEmail || ''
        const prData=await productModel.find({
            isActive: true ,
            catStatus:true,
            leagueStatus:true,
            brandStatus:true
        }).populate('brand').populate('category').populate('team').populate('league')
        res.render('user/productListing',{user,prData})
    } catch (error) {
     console.log(error.message);   
    }
}




module.exports={loadSingleProduct,loadShop}