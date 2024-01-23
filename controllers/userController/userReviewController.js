
const productModel = require('../../models/productModel')
//adding new product review
const addNewReview = async (req, res,next) => {
    try {
        const userId = req.session.userId
        const { rating, comment, productId } = req.body
        const productData = await productModel.findOne({ _id: productId })
        const specificReview = productData.review.find((review) => review.userId.toString() == userId);
        const reviewExists = !!specificReview;
        if (reviewExists) {
            return res.status(200).json({ userExist: 'user review exists' })
        } else {
            const reviewData = {
                userId: userId,
                comment: comment,
                rating: rating
            }
            productData.review.push(reviewData)
            const ratedStars=productData.review.reduce((acc,curr)=>{
              return acc+=curr.rating
            },0)
            const totalStars=(productData.review.length)*5
            const avgRating=(ratedStars/totalStars)*5
            productData.avgRating=avgRating
            await productData.save()
            return res.status(200).json({ success: 'success' })
        }
    } catch (error) {
        console.log(error.message);
        next(error)

    }
}


module.exports = {
    addNewReview
}