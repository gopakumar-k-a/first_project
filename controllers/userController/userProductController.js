const productModel = require('../../models/productModel')
const brandModel = require('../../models/brandModel')
const categoryModel = require('../../models/categoryModel')
const mongoose = require('mongoose')
//load single product details page
const loadSingleProduct = async (req, res) => {
    try {
        const user = req.session.userEmail || ''
        const id = req.query._id
        const product = await productModel.findOne({ _id: id }).populate('brand').populate('category').populate('team').populate('league')
        const relatedProductsBrands = await productModel.find({ brand: product.brand._id }).populate('brand').limit(5)
        return res.render('user/singleProduct', { user, product, relatedProductsBrands })
    } catch (error) {
        console.log(error.message);
    }
}
//load shop page
const loadShop = async (req, res) => {
    try {
        const user = req.session.userEmail || ''
        const keyword = req.query.keyword || ''
        const sortBy = req.query.sortBy || ''
        const brandFilter = req.query.brandfilter || ''
        const categoryFilter = req.query.categoryfilter || ''
        const filterStatus = brandFilter != '' ||  categoryFilter != '' ? true : false




        if (keyword != 'not found') {
            let sortOptions = {};

            switch (sortBy) {
                case 'name-asc':
                    sortOptions = { name: 1 };
                    break;
                case 'name-desc':
                    sortOptions = { name: -1 };
                    break;
                case 'price-asc':
                    sortOptions = { price: 1 };
                    break;
                case 'price-desc':
                    sortOptions = { price: -1 };
                    break;
                case 'relevance':
                    sortOptions = { createdAt: -1 }

                default:
                    sortOptions = { createdAt: -1 };
                    break;
            }
            const page = req.query.page || 1

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
                        ...(categoryFilter && { category: new mongoose.Types.ObjectId(categoryFilter) }), // Convert to ObjectId if not empty
                        ...(brandFilter && { brand: new mongoose.Types.ObjectId(brandFilter) }),


                    }
                },
                {
                    $sort: sortOptions,
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
                        ...(categoryFilter && { category: new mongoose.Types.ObjectId(categoryFilter) }), // Convert to ObjectId if not empty
                        ...(brandFilter && { brand: new mongoose.Types.ObjectId(brandFilter) }),

                    }
                },
                { $group: { _id: null, totalCount: { $sum: 1 } } }




            ])

            // const count = countOfDocuments[0].totalCount
            const count = countOfDocuments.length > 0 ? countOfDocuments[0].totalCount : 0;

            const brandData = await brandModel.find({})
            const categoryData = await categoryModel.find({})


            const userIndices = prData.map((user, index) => index + 1 + skip);
            res.render('user/productListing', {
                user, prData,
                userIndices: userIndices,
                pageCount: Math.ceil(count / limit),
                currentPage: page,
                limit: limit,
                keyword: keyword,
                sortBy: sortBy,
                foundCheck: true,
                brandData: brandData,
                categoryData: categoryData,
                brandFilter: brandFilter,
                categoryFilter: categoryFilter,
                filterStatus:filterStatus

            })
        }

        if (keyword == 'not found') {
            res.render('user/productListing', {
                user, prData: '',
                userIndices: '',
                pageCount: '',
                currentPage: '',
                limit: '',
                keyword: 'no results found',
                foundCheck: false
            })
        }
    } catch (error) {
        console.log(error.message);
    }
}
//search product from the shop page
const searchProduct = async (req, res) => {
    try {

        const keyword = req.body.keyword;
        const sortBy = req.body.sortBy;
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


        if (searchResults.length > 0) {
            res.redirect(`/shop?keyword=${keyword}&sortBy=${sortBy}`)
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