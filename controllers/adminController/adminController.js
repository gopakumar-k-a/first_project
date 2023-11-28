//load log in page

const categoryModel = require('../../models/categoryModel')

const loadLogin = async (req, res) => {

    try {
        res.render('admin/adminLogin')
    } catch (error) {
        console.log(error.message)
    }
}
//load dashboard page
const loadDashboard = async (req, res) => {
    try {
        res.render('admin/adminDashboard')
    } catch (error) {

    }
}
//load product list page
const loadProjectList = async (req, res) => {
    try {
        res.render('admin/productList')
    } catch (error) {
        console.log(error.message);
    }
}

//load add product page

const loadAddProduct = async (req, res) => {
    try {
        res.render('admin/addProduct')

    } catch (error) {
        console.log(error.message);
    }
}
//category management ======================
//load category page
const loadCategory = async (req, res) => {
    try {

        const csMessage = req.query.csMessage || ''
        const catData=await categoryModel.find({})
        console.log(catData);
        res.render('admin/categoryManagement', { ceMessage: '', csMessage,catData })
    } catch (error) {
        console.log(error.message);
    }
}



//adding category
const addCategory = async (req, res) => {
    try {

        const category = req.body.categoryName.toLowerCase();
        if (!category) {
            return res.render('admin/categoryManagement', { ceMessage: 'please fill the field', csMessage: '' })
        }

        const matchCategory = await categoryModel.find({ name: category })
        if (matchCategory.length > 0) {
            return res.render('admin/categoryManagement', { ceMessage: 'value already exists', csMessage: '' })
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
//editing category (testing phase)
const loadEditCategory=async(req,res)=>{
    try {
        // const modelName = req.query.col;
        // const id = req.query.id;

        // // Use the model name directly to find data by ID
        // const data = await mongoose.model(modelName).findById(id);
        // console.log('data is'+data)
        const id=req.query.id
        const colName=req.query.col

        res.render('admin/updateCat',{colName,id})
    } catch (error) {
        console.log(error.message)
    }
}
const updateCatName=async(req,res)=>{
   const catName=req.body.catName
   const id=req.body.id

   console.log(catName,'  ',id,'  ','updatecatName');
   await categoryModel.findByIdAndUpdate({_id:id},{name:catName})
   return res.redirect('/admin/category-management?csMessage=value updated successfully')
}

//block and unblock category
//==================================
const blockCat=async(req,res)=>{
    const categoryId=req.query._id
    console.log(categoryId+'   category id');
    await categoryModel.updateOne({ _id: categoryId }, { isActive: false });
    return res.redirect('/admin/category-management')
}

const unblockCat=async(req,res)=>{
    const categoryId=req.query._id
    console.log(categoryId+'   category id');
    await categoryModel.updateOne({ _id: categoryId }, { isActive: true });
    return res.redirect('/admin/category-management')
}
//=======================================================
module.exports = {
    loadLogin, loadDashboard, loadProjectList, loadAddProduct,
    loadCategory, addCategory,loadEditCategory,blockCat,unblockCat,
    updateCatName
}