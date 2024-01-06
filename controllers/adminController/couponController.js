const couponModel = require('../../models/couponModel');


const loadCoupon = async (req, res) => {
    try {
        const couponData = await couponModel.find({}).sort({ createdAt: -1 })
        // console.log(couponData);
        const data = req.query.data || ''
        const status = req.query.status || ''
        let successMsg = ''
        let errorMsg = ''

        if (status == 'success') {
            successMsg = data
            errorMsg = ''
        } else {
            errorMsg = data
            successMsg = ''
        }





        res.render('admin/coupon', { couponData, successMsg, errorMsg })
    } catch (error) {
        console.log(error.message);
    }
}

const addNewCoupon = async (req, res) => {
    try {
        // console.log(req.body,'req.body in backend');
        const {
            couponName,
            minPurchase,
            limitOfCoupon,
            expiryDate,
            description,
            flat,
            discount
        } = req.body

        const trimmedName = couponName.trim().toUpperCase()
        const matchCouponName = await couponModel.findOne({ name: trimmedName })
        if (matchCouponName) {

            res.status(200).json({ message: 'Coupon name already exists' });

        } else {


            const newCoupon = new couponModel({
                name: trimmedName,
                minimumPurchase: minPurchase,
                limit: limitOfCoupon,
                flatOffer: flat,
                discountPercent: discount,
                description: description,
                expiryDate: expiryDate
            })
            await newCoupon.save()
            res.status(200).json({ message: 'Coupon added successfully' });
        }
    } catch (error) {
        console.log(error.message);
    }
}

const editCoupon = async (req, res) => {
    try {
        // console.log(req.body);
        const {
            couponName,
            minPurchase,
            limitOfCoupon,
            expiryDate,
            description,
            flat,
            discount,
            id
        } = req.body

        const trimmedName = couponName.trim().toUpperCase()
        const matchCouponName = await couponModel.findOne({
            _id: { $ne: id },
            name: trimmedName
        });

        if (matchCouponName) {

            return res.status(200).json({ message: 'failed' });

        } else {
            await couponModel.findByIdAndUpdate(
                id, {
                $set: {
                    name: trimmedName,
                    minimumPurchase: minPurchase,
                    limit: limitOfCoupon,
                    flatOffer: flat,
                    discountPercent: discount,
                    description: description,
                    expiryDate: expiryDate
                }
            })
            return res.status(200).json({ message: 'Editing success' });

        }

    } catch (error) {
        console.log(error.message);
    }
}

const changeActive = async (req, res) => {
    try {
        console.log(req.body);
        const {couponId,status}=req.body
        await couponModel.findByIdAndUpdate(couponId,{$set:{isActive:status}})
        
        res.status(200).json({message:'success'})
    } catch (error) {
        console.log(error.message);
    }
}



module.exports = { loadCoupon, addNewCoupon, editCoupon, changeActive }