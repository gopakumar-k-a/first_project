const userModel = require('../../models/userModel')
//add new address for user
const addAddress = async (req, res) => {
    try {
        const { firstName, lastName, phone, altPhone, houseName,
            city, state, pincode, landMark } = req.body
        const id = req.query._id
        const from = req.query.from
        const userMatch = await userModel.findOne({ _id: id })
        if (userMatch) {
            const newAddress = {
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                altPhone: altPhone,
                houseName: houseName,
                city: city,
                state: state,
                pincode: pincode,
                landMark: landMark,
            };
            userMatch.address.push(newAddress)
            await userMatch.save()
            if (from == 'checkout') {
                res.redirect('/checkout')
            }
            res.redirect('/user-dashboard?goto=user+address')
        }
        else {
            res.send('user not found')
        }

    } catch (error) {
        console.log(error.message);
    }
}
//load editing page for the user
const loadAddressEdit = async (req, res) => {
    try {
        const user = req.session.userEmail || ''
        const userId = req.session.userId
        const index = parseInt(req.query.index, 10)
        const userData = await userModel.findOne({ _id: userId })

        const address = userData.address[index]

        res.render('user/addressEdit', { user, address, index })
    } catch (error) {
        console.log(error.message);
    }
}
// updating the user address
const updateAddress = async (req, res) => {
    try {
        const id = req.session.userId
        const checkOutCheck = req.body.checkOutCheck
        const { index, firstName, lastName, phone, altPhone, houseName,
            city, state, pincode, landMark, from } = req.body
        const addressPos = parseInt(index, 10)
        const userMatch = await userModel.findOne({ _id: id })
        if (userMatch) {
            userMatch.address[addressPos] = {
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                altPhone: altPhone,
                houseName: houseName,
                city: city,
                state: state,
                pincode: pincode,
                landMark: landMark
            };
            await userMatch.save();
            if (from == 'dashboard') {
                res.redirect('/user-dashboard?goto=user+address')
            }else if(from=='checkout'){
                res.redirect('/checkout')
            }

        }
        else {
            res.send('user not found')
        }
        res.send('success')

    } catch (error) {
        console.log(error.message);
    }
}
//deleting address from the users document
const deleteAddress = async (req, res,next) => {
    try {
        const userId = req.session.userId
        const index = req.query.index
        const userData = await userModel.findById(userId)
        userData.address.splice(index, 1);
        await userData.save()

        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.log(error.message);
        next(error)
    }
}
module.exports = {
    addAddress, loadAddressEdit, updateAddress, deleteAddress
}