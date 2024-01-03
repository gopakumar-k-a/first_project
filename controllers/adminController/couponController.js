const couponModel=require('../../models/couponModel');


const loadCoupon=async(req,res)=>{
    try {
        const couponData=await couponModel.find({}).sort({createdAt:-1})
        console.log(couponData);

        res.render('admin/coupon',{couponData})
    } catch (error) {
        console.log(error.message);
    }
}

const addNewCoupon=async(req,res)=>{
    try {
        console.log(req.body,'req.body in backend');
        const {
            couponName,
            minPurchase,
            limitOfCoupon,
            expiryDate,
            description,
            flat,
            discount
          } =req.body
        const matchCouponName=await couponModel.find({name:couponName})
        if(matchCouponName && matchCouponName.length>0){
console.log('name already exists');
//dummy part
        }else{

      
       
          
          
          
           const newCoupon=new couponModel({
            name:couponName,
            minimumPurchase:minPurchase,
            limit:limitOfCoupon,
            flatOffer:flat,
            discountPercent:discount,
            description:description,
            expiryDate:expiryDate
           })
           await newCoupon.save()
        }
        res.status(200).json({message:'success'})
    } catch (error) {
        console.log(error.message);
    }
}

module.exports={loadCoupon,addNewCoupon}