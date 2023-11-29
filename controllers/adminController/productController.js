
//admin data and userdata
const userModel = require('../../models/userModel')
//cateogry data(cricket ,football)
const categoryModel = require('../../models/categoryModel')
//league data(nations ,club)
const leagueModel = require('../../models/leagueModel')
//team data(eg:india,barcelona)
const teamModel = require('../../models/teamModel')

const mongoose = require('mongoose')






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
        const ceMessage = req.query.ceMessage || ''
        const lsMessage = req.query.lsMessage || ''
        const leMessage = req.query.leMessage || ''
        const tsMessage = req.query.tsMessage || ''
        const teMessage=req.query.teMessage || ''
        const catData = await categoryModel.find({})
        const leagueData = await leagueModel.find({})
        const teamData = await teamModel.find({})
        // console.log(catData);
        res.render('admin/categoryManagement', {
            ceMessage, leMessage, teMessage,
            lsMessage, csMessage, tsMessage, catData, leagueData, teamData, leagueData
        })
    } catch (error) {
        console.log(error.message);
    }
}





//inserting team



//editing category/updating data (testing phase not currently using now sweet alert is used)
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
//===================category management===============================
//inserting category
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
//update category name
const updateCatName = async (req, res) => {
    try {
        const catName = req.body.catName;
        const id = req.body.id;

        // Find the category by id
        const existingData = await categoryModel.find({ name: catName, _id: { $ne: id } });
        console.log(existingData+'  this is ');

        console.log(existingData.name + ' - update data');

        // Check if the new name is the same as the existing one
        if (existingData.length>0) {
            return res.redirect('/admin/category-management?ceMessage=name already exists');
        } else {
            // Update the category name
            await categoryModel.updateOne({ _id: id }, { name: catName });

            return res.redirect('/admin/category-management?csMessage=value updated successfully');
        }
    } catch (error) {
        console.log(error.message);
        return res.redirect('/admin/category-management?errorMessage=' + encodeURIComponent(error.message));
    }
};









//block and unblock category
const blockCat = async (req, res) => {
    try {
        const categoryId = req.query._id
        console.log(categoryId + '   category id');
        await categoryModel.updateOne({ _id: categoryId }, { isActive: false });
        return res.redirect('/admin/category-management')
    } catch (error) {
        console.log(error.message);
    }

}

const unblockCat = async (req, res) => {
    try {
        const categoryId = req.query._id
        console.log(categoryId + '   category id');
        await categoryModel.updateOne({ _id: categoryId }, { isActive: true });
        return res.redirect('/admin/category-management')
    } catch (error) {
        console.log(error.message);
    }

}
//=========================league management==============================
//inserting league

const insertLeague = async (req, res) => {
    try {

        const league = req.body.categoryName.toLowerCase();
        if (!league) {
            const err = 'please fill the field'
            // return res.render('admin/categoryManagement', { leMessage: 'please fill the field', csMessage: '',ceMessage:'',lsMessage })
            return res.redirect(`/admin/category-management?leMessage=${err}`);
        }

        const matchLeague = await leagueModel.find({ name: league })
        if (matchLeague.length > 0) {
            const err = 'value already exists'
            return res.redirect(`/admin/category-management?leMessage=${err}`);
            // return res.render('admin/categoryManagement', { leMessage: 'value already exists', csMessage: '',ceMessage:'',lsMessage })
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
//update league name
const updateLeagueName = async (req, res) => {
    try {
        const leagueName = req.body.leagueName;
        const id = req.body.id;
   
        // Find the category by id
        const existingData = await leagueModel.find({ name: leagueName, _id: { $ne: id } });
        console.log(existingData+'  this is dataleague ');

        console.log(existingData.name + ' dataleague name');

        // Check if the new name is the same as the existing one
        if (existingData.length>0) {
            return res.redirect('/admin/category-management?leMessage=name already exists');
        } else {
            // Update the category name
            await leagueModel.updateOne({ _id: id }, { name: leagueName });

            return res.redirect('/admin/category-management?lsMessage=value updated successfully');
        }
    } catch (error) {
        console.log(error.message);

    }
};
//block and ublock league
const blockLeague = async (req, res) => {
    try {
        const leagueId = req.query._id
        await leagueModel.updateOne({ _id: leagueId }, { isActive: false })
        return res.redirect('/admin/category-management')
    } catch (error) {
        console.log(error.message);
    }

}
const unblockLeague = async (req, res) => {
    const leagueId = req.query._id
    await leagueModel.updateOne({ _id: leagueId }, { isActive: true })
    return res.redirect('/admin/category-management')
}


//============================team management===================================
const insertTeam = async (req, res) => {
    try {

        const team = req.body.teamName.toLowerCase();
        if (!team) {
            const err='please fill the fields'
            return res.redirect(`/admin/category-management?teMessage=${err}`);
            // return res.render('admin/categoryManagement', { teMessage: 'team added succesfully', leMessage: '', csMessage: '', ceMessage: '', lsMessage })
        }

        const matchTeam = await teamModel.find({ name: team })
        if (matchTeam.length > 0) {
            const err='team already exists'
            return res.redirect(`/admin/category-management?teMessage=${err}`);        }
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

//update team

const updateTeamName = async (req, res) => {
    try {
        const teamName = req.body.teamName;
        const id = req.body.id;
        // Find the category by id
        const existingData = await teamModel.find({ name: teamName, _id: { $ne: id } });
        console.log(existingData+'  this is dataleague ');

        console.log(existingData.name + ' dataleague name');

        // Check if the new name is the same as the existing one
        if (existingData.length>0) {
            return res.redirect('/admin/category-management?teMessage=name already exists');
        } else {
            // Update the category name
            await leagueModel.updateOne({ _id: id }, { name: teamName });

            return res.redirect('/admin/category-management?tsMessage=value updated successfully');
        }
    } catch (error) {
        console.log(error.message);

    }
};
//block and ublock team
const blockTeam = async (req, res) => {
    try {
        const teamId = req.query._id
        await teamModel.updateOne({ _id: teamId }, { isActive: false })
        return res.redirect('/admin/category-management')
    } catch (error) {
        console.log(error.message);
    }

}
const unblockTeam = async (req, res) => {
    try {
        const teamId = req.query._id
        await teamModel.updateOne({ _id: teamId }, { isActive: true })
        return res.redirect('/admin/category-management')
    } catch (error) {
        console.log(error.message);
    }

}

module.exports={ loadProjectList, loadAddProduct,
    loadCategory, addCategory, loadEditCategory, blockCat, unblockCat,
    updateCatName, insertLeague, blockLeague, unblockLeague,
    insertTeam,updateLeagueName,blockTeam,unblockTeam,updateTeamName
}