const categoryModel = require('../../models/categoryModel')
const leagueModel = require('../../models/leagueModel')
const teamModel = require('../../models/teamModel')
const brandModel = require('../../models/brandModel')
const productModel = require('../../models/productModel')
const sharp = require('sharp')
const fs = require('node:fs')

const loadProjectList = async (req, res) => {
    try {
        const page = req.query.page || 1
        const count = await productModel.find().count()
        const limit = 5
        const skip = (page - 1) * limit
        const proData = await productModel.find({}).sort({ createdAt: -1 }).limit(limit).skip(skip)
        const prIndices = proData.map((user, index) => index + 1 + skip);
        return res.render('admin/productList', {
            proData: proData,
            prIndices: prIndices,
            pageCount: Math.ceil(count / limit),
            currentPage: page,
            limit: limit

        })
    } catch (error) {
        console.log(error.message);
    }
}

const loadAddProduct = async (req, res) => {
    try {
        const errMessage = req.query.errMessage || ''
        const sccMessage = req.query.sccMessage || ''
        const catData = await categoryModel.find({}).sort({ name: 1 })
        const leagueData = await leagueModel.find({}).sort({ name: 1 })
        const teamData = await teamModel.find({}).sort({ name: 1 })
        const brandData = await brandModel.find({}).sort({ name: 1 })

        res.render('admin/addProduct', { catData, leagueData, teamData, brandData, errMessage, sccMessage })

    } catch (error) {
        console.log(error.message);
    }
}

const loadEditProduct = async (req, res) => {
    try {
        const id = req.query._id

        const errMessage = req.query.errMessage || ''
        const sccMessage = req.query.sccMessage || ''
        const proData = await productModel.findOne({ _id: id })
            .populate('category')
            .populate('league')
            .populate('team')
            .populate('brand');
        const catData = await categoryModel.find({ isActive: true }).sort({ name: 1 })
        const leagueData = await leagueModel.find({ isActive: true }).sort({ name: 1 })
        const teamData = await teamModel.find({ isActive: true }).sort({ name: 1 })
        const brandData = await brandModel.find({ isActive: true }).sort({ name: 1 })

        res.render('admin/editProduct', { catData, leagueData, teamData, brandData, errMessage, sccMessage, proData })

    } catch (error) {
        console.log(error.message);
    }
}

const loadCategory = async (req, res) => {
    try {

        const csMessage = req.query.csMessage || ''
        const ceMessage = req.query.ceMessage || ''
        const lsMessage = req.query.lsMessage || ''
        const leMessage = req.query.leMessage || ''
        const tsMessage = req.query.tsMessage || ''
        const teMessage = req.query.teMessage || ''
        const beMessage = req.query.beMessage || ''
        const bsMessage = req.query.beMessage || ''
        const catData = await categoryModel.find({})
        const leagueData = await leagueModel.find({})
        const teamData = await teamModel.find({})
        const brandData = await brandModel.find({})
        res.render('admin/categoryManagement', {
            ceMessage, leMessage, teMessage,
            lsMessage, csMessage, tsMessage, beMessage, bsMessage,
            catData, leagueData, teamData, brandData
        })
    } catch (error) {
        console.log(error.message);
    }
}

const loadEditCategory = async (req, res) => {
    try {

        const id = req.query.id
        const colName = req.query.col
        const model = req.query.model


        res.render('admin/updateCat', { colName, id, model })
    } catch (error) {
        console.log(error.message)
    }
}
const addCategory = async (req, res) => {
    try {

        const category = req.body.categoryName.toLowerCase();
        if (!category) {
            const err = 'please fill the field';
            return res.redirect(`/admin/category-management?ceMessage=${err}`);

        }

        const matchCategory = await categoryModel.find({ name: category })
        if (matchCategory.length > 0) {
            const err = 'value already existsa'
            return res.redirect(`/admin/category-management?ceMessage=${err}`);
        }
        else {
            const cat = new categoryModel({
                name: category
            })
            await cat.save()
            const csMessage = 'value added successfully'
            return res.redirect(`/admin/category-management/?csMessage=${csMessage}`);

        }
    } catch (error) {
        console.log(error.message)
    }
}
const updateCatName = async (req, res) => {
    try {
        const catName = req.body.catName;
        const id = req.body.id;
        const existingData = await categoryModel.find({ name: catName, _id: { $ne: id } });
        if (existingData.length > 0) {
            return res.redirect('/admin/category-management?ceMessage=name already exists');
        } else {
            await categoryModel.updateOne({ _id: id }, { name: catName });

            return res.redirect('/admin/category-management?csMessage=value updated successfully');
        }
    } catch (error) {
        console.log(error.message);
        return res.redirect('/admin/category-management?errorMessage=' + encodeURIComponent(error.message));
    }
};


const blockCat = async (req, res) => {
    try {
        const categoryId = req.query._id
        await categoryModel.updateOne({ _id: categoryId }, { isActive: false });
        await productModel.updateMany({ _id: categoryId }, { $set: { catStatus: false } })
        return res.redirect('/admin/category-management')
    } catch (error) {
        console.log(error.message);
    }

}

const unblockCat = async (req, res) => {
    try {
        const categoryId = req.query._id
        await categoryModel.updateOne({ _id: categoryId }, { isActive: true });
        await productModel.updateMany({ _id: categoryId }, { $set: { catStatus: false } })
        return res.redirect('/admin/category-management')
    } catch (error) {
        console.log(error.message);
    }

}

const insertLeague = async (req, res) => {
    try {

        const league = req.body.categoryName.toLowerCase();
        if (!league) {
            const err = 'please fill the field'
            return res.redirect(`/admin/category-management?leMessage=${err}`);
        }

        const matchLeague = await leagueModel.find({ name: league })
        if (matchLeague.length > 0) {
            const err = 'value already exists'
            return res.redirect(`/admin/category-management?leMessage=${err}`);
        }
        else {
            const data = new leagueModel({
                name: league
            })
            await data.save()
            const lsMessage = 'value added successfully'
            return res.redirect(`/admin/category-management/?lsMessage=${lsMessage}`);

        }
    } catch (error) {
        console.log(error.message)
    }
}

const updateLeagueName = async (req, res) => {
    try {
        const leagueName = req.body.leagueName;
        const id = req.body.id;
        const existingData = await leagueModel.find({ name: leagueName, _id: { $ne: id } });
        if (existingData.length > 0) {
            return res.redirect('/admin/category-management?leMessage=name already exists');
        } else {
            await leagueModel.updateOne({ _id: id }, { name: leagueName });
            return res.redirect('/admin/category-management?lsMessage=value updated successfully');
        }
    } catch (error) {
        console.log(error.message);

    }
};

const blockLeague = async (req, res) => {
    try {
        const leagueId = req.query._id
        await leagueModel.updateOne({ _id: leagueId }, { isActive: false })
        await productModel.updateMany({ league: leagueId }, { $set: { leagueStatus: false } })
        return res.redirect('/admin/category-management')
    } catch (error) {
        console.log(error.message);
    }

}
const unblockLeague = async (req, res) => {
    const leagueId = req.query._id
    await leagueModel.updateOne({ _id: leagueId }, { isActive: true })
    await productModel.updateMany({ _id: leagueId }, { $set: { leagueStatus: true } })
    return res.redirect('/admin/category-management')
}

const insertTeam = async (req, res) => {
    try {

        const team = req.body.teamName.toLowerCase();
        if (!team) {
            const err = 'please fill the fields'
            return res.redirect(`/admin/category-management?teMessage=${err}`);

        }

        const matchTeam = await teamModel.find({ name: team })
        if (matchTeam.length > 0) {
            const err = 'team already exists'
            return res.redirect(`/admin/category-management?teMessage=${err}`);
        }
        else {
            const data = new teamModel({
                name: team
            })
            await data.save()
            const tsMessage = 'team added successfully'
            return res.redirect(`/admin/category-management/?tsMessage=${tsMessage}`);

        }
    } catch (error) {
        console.log(error.message)
    }
}

const updateTeamName = async (req, res) => {
    try {
        const teamName = req.body.teamName;
        const id = req.body.id;
        const existingData = await teamModel.find({ name: teamName, _id: { $ne: id } });
        if (existingData.length > 0) {
            return res.redirect('/admin/category-management?teMessage=name already exists');
        } else {
            await teamModel.updateOne({ _id: id }, { name: teamName });
            return res.redirect('/admin/category-management?tsMessage=value updated successfully');
        }
    } catch (error) {
        console.log(error.message);

    }
};

const insertBrand = async (req, res) => {
    try {
        const brand = req.body.brandName;

        const matchBrand = await brandModel.find({ name: brand });

        if (matchBrand.length > 0) {
            const err = 'Brand already exists';
            return res.redirect(`/admin/category-management?beMessage=${err}`);
        } else {

            const resizedImg = `resized_${req.file.filename}`;
            await sharp(req.file.path)
                .resize({ width: 300, height: 300 })
                .toFile(`public/admin-assets/uploads/${resizedImg}`);


            const data = new brandModel({
                name: brand,
                imageUrl: resizedImg,
            });

            await data.save();

            const bsMessage = 'Brand added successfully';
            return res.redirect(`/admin/category-management/?bsMessage=${bsMessage}`);
        }
    } catch (error) {

        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
};

const updateBrandName = async (req, res) => {
    try {
        const brandName = req.body.brandName;
        const id = req.body.id;
        const existingData = await brandModel.find({ name: brandName, _id: { $ne: id } });
        if (existingData.length > 0) {
            return res.redirect('/admin/category-management?teMessage=name already exists');
        } else {
            await brandModel.updateOne({ _id: id }, { name: brandName });

            return res.redirect('/admin/category-management?tsMessage=value updated successfully');
        }
    } catch (error) {
        console.log(error.message);

    }
};

const blockBrand = async (req, res) => {
    try {
        const brandId = req.query._id
        await brandModel.updateOne({ _id: brandId }, { isActive: false })
        await productModel.updateMany({ brand: brandId }, { $set: { brandStatus: false } })
        return res.redirect('/admin/category-management')
    } catch (error) {
        console.log(error.message);
    }

}
const unblockBrand = async (req, res) => {
    try {
        const brandId = req.query._id
        await brandModel.updateOne({ _id: brandId }, { isActive: true })
        await productModel.updateMany({ brand: brandId }, { $set: { brandStatus: true } })
        return res.redirect('/admin/category-management')
    } catch (error) {
        console.log(error.message);
    }

}

const blockProduct = async (req, res) => {
    try {
        let productId = req.query._id
        let status = req.query.status
        if (status == 'block') {
            await productModel.updateOne({ _id: productId }, { $set: { isActive: false } })
            return res.redirect('/admin/product-list')
        }
        else if (status = 'unblock') {
            await productModel.updateOne({ _id: productId }, { $set: { isActive: true } })
            return res.redirect('/admin/product-list')
        }
    } catch (error) {
        console.log(error.message);
    }
}




//insert product
const insertProduct = async (req, res) => {
    try {
        const {
            productName,
            categoryId,
            leagueId,
            teamId,
            brandId,
            productDesc,
            smallQty,
            mediumQty,
            largeQty,
            salePrice,
            regularPrice,
        } = req.body;
        const matchData = await productModel.find({ name: productName })
        if (matchData.length > 0) {
            const errMessage = 'value already exists'
            return res.redirect('/admin/add-product?errMessage=' + errMessage)
        }
        else {
            const images = [];
            for (const file of req.files) {
                const resizedImg = `resized_${file.filename}`;
                await sharp(file.path)
                    .resize({ width: 470, height: 470 })
                    .toFile(`public/admin-assets/uploads/${resizedImg}`);

                images.push(resizedImg);
            };
            const newProduct = new productModel({
                name: productName,
                category: categoryId,
                league: leagueId,
                team: teamId,
                brand: brandId,
                description: productDesc,
                size: {
                    s: { quantity: smallQty },
                    m: { quantity: mediumQty },
                    l: { quantity: largeQty },
                },
                price: { salePrice, regularPrice },
                imagesUrl: images
            });
            await newProduct.save()
            const sccMessage = 'value added successfully'
            return res.redirect('/admin/add-product?sccMessage=' + sccMessage)

        }

    } catch (error) {
        console.log(error.message)
    }
}
const editProduct = async (req, res) => {
    try {
        const id = req.query._id
        const newImages = req.files.map((file) => file.filename)
        const {
            productName,
            categoryId,
            leagueId,
            teamId,
            brandId,
            productDesc,
            smallQty,
            mediumQty,
            largeQty,
            salePrice,
            regularPrice,
        } = req.body;

        if (newImages.length > 0) {

            const resizedImages = [];
            for (const file of req.files) {
                const resizedImg = `resized_${file.filename}`;
                await sharp(file.path)
                    .resize({ width: 470, height: 470 })
                    .toFile(`public/admin-assets/uploads/${resizedImg}`);
                resizedImages.push(resizedImg);
            }

            await productModel.updateOne(
                { _id: id },
                { $push: { imagesUrl: { $each: resizedImages } } }
            );
        }

        await productModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    name: productName,
                    category: categoryId,
                    league: leagueId,
                    team: teamId,
                    brand: brandId,
                    description: productDesc,
                    size: {
                        s: { quantity: smallQty },
                        m: { quantity: mediumQty },
                        l: { quantity: largeQty },
                    },
                    price: { salePrice, regularPrice },
                },
            }
        );
        const sccMessage = 'product data updated successfully'
        res.redirect('/admin/edit-product?_id=' + id + '&sccMessage=' + sccMessage)
    } catch (error) {
        console.log(error.message);
    }
}

const deleteImage = async (req, res) => {
    try {
        const id = req.query.pr_id;
        const imageIndexToDelete = parseInt(req.query.img_index, 10);
        const product = await productModel.findById(id);
        if (product && product.imagesUrl) {
            product.imagesUrl.splice(imageIndexToDelete, 1);
            await product.save();
            res.status(200).json({ message: 'Image deleted successfully' });
        } else {
            res.status(404).json({ error: 'Product not found or image not deleted' });
        }


    } catch (error) {
        console.log(error.message);
    }
}






module.exports = {
    loadProjectList, loadAddProduct, loadCategory, addCategory,
    loadEditCategory, blockCat, unblockCat, updateCatName,
    insertLeague, blockLeague, unblockLeague, insertTeam,
    updateLeagueName, updateTeamName, insertBrand, blockBrand,
    unblockBrand, updateBrandName, insertProduct, loadEditProduct,
    blockProduct, editProduct, deleteImage

}