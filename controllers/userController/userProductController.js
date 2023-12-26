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
        const keyword = req.query.keyword || ''
        if (keyword != 'not found') {
            const page = req.query.page || 1


            console.log(req.query.keyword);
            const limit = 3
            const skip = (page - 1) * limit

            const prData = await productModel.aggregate([
                {
                    $match: {
                        isActive: true,
                        catStatus: true,
                        leagueStatus: true,
                        brandStatus: true,
                        $or: [
                            { name: { $regex: keyword, $options: 'i' } },
                            { description: { $regex: keyword, $options: 'i' } },
                            { 'brand.name': { $regex: keyword, $options: 'i' } },
                            { 'team.name': { $regex: keyword, $options: 'i' } },
                            { 'league.name': { $regex: keyword, $options: 'i' } },
                            { 'category.name': { $regex: keyword, $options: 'i' } },
                        ],
                    }
                },
                { $skip: skip },
                { $limit: limit },




            ])



            const countOfDocuments = await productModel.aggregate([
                {
                    $match: {
                        isActive: true,
                        catStatus: true,
                        leagueStatus: true,
                        brandStatus: true,
                        $or: [
                            { name: { $regex: keyword, $options: 'i' } },
                            { description: { $regex: keyword, $options: 'i' } },
                            { 'brand.name': { $regex: keyword, $options: 'i' } },
                            { 'team.name': { $regex: keyword, $options: 'i' } },
                            { 'league.name': { $regex: keyword, $options: 'i' } },
                            { 'category.name': { $regex: keyword, $options: 'i' } },
                        ],
                    }
                },
                { $group: { _id: null, totalCount: { $sum: 1 } } }




            ])

            const count = countOfDocuments[0].totalCount




            const userIndices = prData.map((user, index) => index + 1 + skip);
            res.render('user/productListing', {
                user, prData,
                userIndices: userIndices,
                pageCount: Math.ceil(count / limit),
                currentPage: page,
                limit: limit,
                keyword: keyword,
                foundCheck:true
            })
        }

        if (keyword == 'not found') {
            res.render('user/productListing', {
                user, prData:'',
                userIndices: '',
                pageCount: '',
                currentPage: '',
                limit:'',
                keyword: 'no results found',
                foundCheck:false
            })
     }
    } catch (error) {
        console.log(error.message);
    }
}

const searchProduct = async (req, res) => {
    try {

        const { keyword } = req.body;

        const regexPattern = new RegExp(keyword, "i");

        const searchResults = await productModel.aggregate([
            {
                $match: {
                    $or: [
                        { name: { $regex: regexPattern } },
                        { description: { $regex: regexPattern } },
                        { 'brand.name': { $regex: regexPattern } },
                        { 'team.name': { $regex: regexPattern } },
                        { 'league.name': { $regex: regexPattern } },
                        { 'category.name': { $regex: regexPattern } },
                    ],
                },
            },
        ])

        console.log(searchResults, '  this is search results');


        if (searchResults.length > 0) {
            res.redirect(`/shop?keyword=${keyword}`)
        }
        if (searchResults.length == 0) {

            const notFoundKeyword = 'not+found';
            res.redirect(`/shop?keyword=${notFoundKeyword}`);
        }

    } catch (error) {
        console.log(error.message);
    }
}




module.exports = { loadSingleProduct, loadShop, searchProduct }