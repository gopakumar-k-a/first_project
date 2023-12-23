const productModel = require('../../models/productModel')

const loadSingleProduct = async (req, res) => {
    try {
        const user = req.session.userEmail || ''
        const id = req.query._id
        const product = await productModel.findOne({ _id: id }).populate('brand').populate('category').populate('team').populate('league')

        const relatedProductsBrands = await productModel.find({ brand: product.brand._id }).populate('brand').limit(5)
        if (relatedProductsBrands) {
            console.log(relatedProductsBrands + 'this is related products');
        }
        return res.render('user/singleProduct', { user, product, relatedProductsBrands })
    } catch (error) {
        console.log(error.message);
    }
}
const loadShop = async (req, res) => {
    try {
        const user = req.session.userEmail || ''
        const page = req.query.page || 1
        const count = await productModel.find().count()
        const limit = 8
        const skip = (page - 1) * limit
        const prData = await productModel.find({
            isActive: true,
            catStatus: true,
            leagueStatus: true,
            brandStatus: true
        }).populate('brand').populate('category').populate('team').populate('league').limit(limit).skip(skip)

        const userIndices = prData.map((user, index) => index + 1 + skip);

        res.render('user/productListing', {
            user, prData,
            userIndices: userIndices,
            pageCount: Math.ceil(count / limit),
            currentPage: page,
            limit: limit
        })
    } catch (error) {
        console.log(error.message);
    }
}




module.exports = { loadSingleProduct, loadShop }