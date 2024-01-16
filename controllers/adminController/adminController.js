
const userModel = require('../../models/userModel')
const orderModel = require('../../models/orderModel')
const productModel = require('../../models/productModel')
const categoryModel = require('../../models/categoryModel')
const bcrypt = require('bcrypt');
const validator = require("validator");

//load admin login
const loadLogin = async (req, res) => {

    try {
        res.render('admin/adminLogin', { message: '' })
    } catch (error) {
        console.log(error.message)
    }
}
//log out admin
const logout = async (req, res) => {
    try {
        req.session.destroy()
        return res.redirect('/admin')
    } catch (error) {
        console.log(error.message);
    }
}
//check email and password before login
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
//load admin dashboard
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
     
        const totalCollection = await orderModel.aggregate([
            {
              $match: {
                paymentStatus: 'success'
              }
            },
            {
              $group: {
                _id: null,
                totalAmount: { $sum: "$totalAmount" }
              }
            }
          ]);
          
        const orderCount = await orderModel.aggregate([
            {
                $group: {
                    _id: null,
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

        const orderData=await orderModel.find({})

        let totalAmount = 0
        let totalOrders = 0
        let orderPendingCount = 0
        let orderProcessingCount = 0
        let orderShippedCount = 0
        let orderDeliveredCount = 0
        let orderCancelledCount = 0
        let codCount = 0
        let upiCount = 0
        let codPaymentAmount = 0
        let upiPaymentAmount = 0
        orderData.forEach((data) => {
           
            totalOrders++
            if (data.orderStatus == 'pending') {
                orderPendingCount++
            } else if (data.orderStatus == 'processing') {
                orderProcessingCount++
            } else if (data.orderStatus == 'shipped') {
                orderShippedCount++
            } else if (data.orderStatus == 'delivered') {
                orderDeliveredCount++
            } else if (data.orderStatus == 'cancelled') {
                orderCancelledCount++
            }
            if(data.paymentMethod == 'cod' && data.paymentStatus == 'success'){
                codPaymentAmount += data.totalAmount
            }
            if(data.paymentMethod == 'upi' && data.paymentStatus == 'success'){
                upiPaymentAmount += data.totalAmount

            }
            if (data.paymentMethod == 'cod') {
                codCount++
                
            } else if (data.paymentMethod == 'upi') {
                upiCount++
             
            }
          

        })
        const orderStats={
            pending:orderPendingCount,
            processing:orderProcessingCount,
            shipped:orderShippedCount,
            delivered:orderDeliveredCount,
            cancelled:orderCancelledCount


        
        }
        

        res.render('admin/adminDashboard', {
            userCountsPerMonth,
            orderCountPerMonth,
            productAddedPerMonth,
            orderCount,
            productCount,
            categoryCount,
            currentMonthIncome,
            totalCollection,
            orderStats
        })
    } catch (error) {
        console.log(error.message);
    }
}
//load sales report page
const loadSalesReport = async (req, res) => {
    try {
        const fromDate = isValidDate(req.query.fromDate) ? new Date(req.query.fromDate) : new Date('2022-02-05');
        const toDate = isValidDate(req.query.toDate) ? new Date(req.query.toDate) : new Date(Date.now());
        const fromDateToFrontEnd = req.query.fromDate || '2022-02-05';
        const toDateToFrontEnd = req.query.toDate ? req.query.toDate : new Date().toISOString().split('T')[0];
        function isValidDate(dateString) {
            return !isNaN(Date.parse(dateString));
        }

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
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userData',
                },
            },
            {
                $unwind: '$userData',
            },
            {
                $sort: { orderedAt: -1 }
            }
        ]);
        // enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
        let totalAmount = 0
        let totalOrders = 0
        let orderPendingCount = 0
        let orderProcessingCount = 0
        let orderShippedCount = 0
        let orderDeliveredCount = 0
        let orderCancelledCount = 0
        let codCount = 0
        let upiCount = 0
        let codPaymentAmount = 0
        let upiPaymentAmount = 0
        orderData.forEach((data) => {
           
            totalOrders++
            if (data.orderStatus == 'pending') {
                orderPendingCount++
            } else if (data.orderStatus == 'processing') {
                orderProcessingCount++
            } else if (data.orderStatus == 'shipped') {
                orderShippedCount++
            } else if (data.orderStatus == 'delivered') {
                orderDeliveredCount++
            } else if (data.orderStatus == 'cancelled') {
                orderCancelledCount++
            }
            if(data.paymentMethod == 'cod' && data.paymentStatus == 'success'){
                codPaymentAmount += data.totalAmount
            }
            if(data.paymentMethod == 'upi' && data.paymentStatus == 'success'){
                upiPaymentAmount += data.totalAmount

            }
            if (data.paymentMethod == 'cod') {
                codCount++
                
            } else if (data.paymentMethod == 'upi') {
                upiCount++
             
            }
          

        })
        totalAmount=codPaymentAmount+upiPaymentAmount

        res.render('admin/salesReport', {
            orderData,
            fromDateToFrontEnd,
            toDateToFrontEnd,
            totalAmount,
            totalOrders,
            orderPendingCount,
            orderProcessingCount,
            orderDeliveredCount,
            orderCancelledCount,
            codCount,
            upiCount,
            codPaymentAmount,
            upiPaymentAmount,
            orderShippedCount
        })
    } catch (error) {
        console.log(error.message);
    }
}
//getting date from the front end for sales report
const dateOfSalesReport = async (req, res) => {
    try {
        const { fromDate, toDate } = req.body
        res.redirect(`/admin/salesreport?fromDate=${fromDate}&toDate=${toDate}`)
    } catch (error) {
        console.log(error.message);
    }
}
//load users list in the admin side
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
//block specific user
const blockUser = async (req, res) => {
    try {
        const id = req.query._id
        await userModel.updateOne({ _id: id }, { $set: { isActive: false } })
        res.status(200).json({ message: 'success' })
    } catch (error) {
        console.log(error.message);
    }
}
//un-block specific user
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
    unBlockUser, logout, loadSalesReport, dateOfSalesReport
}