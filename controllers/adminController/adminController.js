
const userModel = require('../../models/userModel')
const orderModel = require('../../models/orderModel')
const productModel = require('../../models/productModel')
const categoryModel = require('../../models/categoryModel')
const bcrypt = require('bcrypt');
const validator = require("validator");


const loadLogin = async (req, res) => {

    try {
        res.render('admin/adminLogin', { message: '' })
    } catch (error) {
        console.log(error.message)
    }
}

const logout = async (req, res) => {
    try {
        req.session.destroy()
        return res.redirect('/admin')
    } catch (error) {
        console.log(error.message);
    }
}

const checkAdmin = async (req, res) => {

    try {
        const { email, password } = req.body
        if (!email || !password) {
            const message = 'all fields must be filled'
            return res.render('admin/adminLogin', { message })
        }
        const isValidEmail = validator.isEmail(email);
        if (!isValidEmail) {
            const message = 'Please enter a valid email';
            return res.render('admin/adminLogin', { message })
        }


        const userMatch = await userModel.findOne({ email: email, isAdmin: true })

        if (userMatch.isAdmin == true) {
            const PasswordMatch = await bcrypt.compare(password, userMatch.password);

            if (PasswordMatch) {
                req.session.isAdmin = email
                return res.redirect('/admin/dashboard')

            }
            else {
                const message = 'incorrect password'
                return res.render('admin/adminLogin', { message })
            }

        } else {
            const message = 'incorrect email or password'
            return res.render('admin/adminLogin', { message })
        }
    } catch (error) {
        console.log(error.message);
    }

}


const loadDashboard = async (req, res) => {
    try {
        const userAddedObject = await userModel.aggregate([
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    count: { $sum: 1 },
                },
            },
        ]);
        const userCountsPerMonth = Array.from({ length: 12 }, (_, monthIndex) => {
            const foundMonth = userAddedObject.find(entry => entry._id === (monthIndex + 1));
            return foundMonth ? foundMonth.count : 0;
        });
        const orderAddedObject = await orderModel.aggregate([
            {
                $group: {
                    _id: { $month: '$orderedAt' },
                    count: { $sum: 1 },
                },
            },

        ]);
        const orderCountPerMonth = Array.from({ length: 12 }, (_, monthIndex) => {
            const foundMonth = orderAddedObject.find(entry => entry._id === (monthIndex + 1));
            return foundMonth ? foundMonth.count : 0;
        });
        const productAddedObject = await productModel.aggregate([
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 1,
                    count: { $ifNull: ['$count', 0] },
                },
            },
        ]);
        const productAddedPerMonth = Array.from({ length: 12 }, (_, monthIndex) => {
            const foundMonth = productAddedObject.find(entry => entry._id === (monthIndex + 1));
            return foundMonth ? foundMonth.count : 0;
        });
        const currentMonth = new Date().getMonth() + 1;

        console.log(currentMonth, ' this is current month');


        const currentMonthIncome = await orderModel.aggregate([
            {
                $match: {
                    orderedAt: {
                        $gte: new Date(new Date().getFullYear(), currentMonth - 1, 1),
                        $lt: new Date(new Date().getFullYear(), currentMonth, 1),
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    currentMonthTotalAmount: { $sum: "$totalAmount" },
                },
            },
        ]);
        console.log('current month income:', currentMonthIncome);


        const orderCount = await orderModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$totalAmount" },
                    countOfOrders: { $sum: 1 },
                },
            }
        ])
        const productCount = await productModel.aggregate([
            {
                $group: {
                    _id: null,
                    countOfProducts: { $sum: 1 }
                }
            },

        ])


        const categoryCount = await categoryModel.aggregate([
            {
                $group: {
                    _id: null,
                    countOfCategory: { $sum: 1 }
                }
            },

        ])




        res.render('admin/adminDashboard', {
            userCountsPerMonth,
            orderCountPerMonth,
            productAddedPerMonth,
            orderCount,
            productCount,
            categoryCount,
            currentMonthIncome
        })
    } catch (error) {
        console.log(error.message);
    }
}
const loadSalesReport = async (req, res) => {
    try {
        // You can dynamically set this value
        const fromDate = new Date('2023-02-05');
        const toDate = new Date('2023-12-31');
        
        const orderData = await orderModel.aggregate([
          {
            $match: {
              orderedAt: {
                $gte: fromDate,
                $lt: toDate,
              },
            },
          },
          {
            $lookup: {
              from: 'users', // Corrected to match the model name used in mongoose.model
              localField: 'userId',
              foreignField: '_id',
              as: 'userData',
            },
          },
          {
            $unwind: '$userData',
          },
          {
            $sort:{orderedAt:-1}
          }
        ]);

        // const orderData=await orderModel.find({}).populate('userId')
        
        console.log(orderData);
        res.render('admin/salesReport', { orderData })
    } catch (error) {
        console.log(error.message);
    }
}
//getting date from the front end
const dateOfSalesReport=async(req,res)=>{
    try {
        console.log(req.body);
    } catch (error) {
        console.log(error.message);
    }
}


const loadUsersList = async (req, res) => {
    try {
        const page = req.query.page || 1
        const count = await userModel.find().count()
        const limit = 5
        const skip = (page - 1) * limit
        const userData = await userModel.find({ isAdmin: false }).sort({ createdAt: -1 }).
            limit(limit).skip(skip)
        const userIndices = userData.map((user, index) => index + 1 + skip);
        return res.render('admin/usersList', {
            userData: userData,
            userIndices: userIndices,
            pageCount: Math.ceil(count / limit),
            currentPage: page,
            limit: limit

        })
    } catch (error) {
        console.log(error.message);
    }
}

const blockUser = async (req, res) => {
    try {
        const id = req.query._id
        await userModel.updateOne({ _id: id }, { $set: { isActive: false } })
        res.status(200).json({ message: 'success' })
    } catch (error) {
        console.log(error.message);
    }
}

const unBlockUser = async (req, res) => {
    try {
        const id = req.query._id
        await userModel.updateOne({ _id: id }, { $set: { isActive: true } })
        res.status(200).json({ message: 'success' })
    } catch (error) {
        console.log(error.message);
    }
}




module.exports = {
    loadLogin, loadDashboard, checkAdmin, loadUsersList, blockUser,
    unBlockUser, logout, loadSalesReport,dateOfSalesReport
}