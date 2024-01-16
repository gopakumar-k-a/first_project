const bannerModel = require('../../models/bannerModel')

//load banner page
const loadBanner = async (req, res) => {
    try {
        const bannerData = await bannerModel.find({})
        res.render('admin/banner', { bannerData })
    } catch (error) {
        console.log(error.message);
    }
}
//load edit banner page
const loadEditBanner = async (req, res) => {
    try {
        const { id } = req.query
        const bannerData = await bannerModel.findOne({ _id: id })
        const startDate = new Date(bannerData.startDate).toISOString().split('T')[0]
        const endDate = new Date(bannerData.endDate).toISOString().split('T')[0]
        res.render('admin/editBanner', { bannerData, startDate, endDate })
    } catch (error) {
        console.log(error.message);
    }
}
//update banner data with image
const PostBannerImage = async (req, res) => {
    try {
        const { name, title, subtitle,
            description, targetedUrl, startDate, endDate } = req.body

        let image = ''
        if (req.file) {
            image = req.file.filename
        }
        if (image != '') {

            const data = new bannerModel({
                name: name,
                title: title,
                subtitle: subtitle,
                description: description,
                targetUrl: targetedUrl,
                startDate: startDate,
                endDate: endDate,
                imageUrl: image
            })
            await data.save()

            setTimeout(() => {
                res.status(200).json({ message: 'success' });
            }, 500);
        }




    } catch (error) {
        console.log(error.message);
    }
}
//update banner data with out image
const editBanner = async (req, res) => {
    try {
        const {
            title,
            subtitle,
            description,
            targetedUrl,
            startDate,
            endDate,
            bannerId
        } = req.body
        const banner = await bannerModel.findById(bannerId)
        if (req.file) {
            const image = req.file.filename
            await bannerModel.updateOne({ _id: bannerId }, {
                $set: {
                    title: title,
                    subtitle: subtitle,
                    description: description,
                    targetUrl: targetedUrl,
                    startDate:new Date(startDate) ,
                    endDate:new Date(endDate),
                    imageUrl: image
                }
            })


            res.status(200).json({ message: true })
            

        } else {
            await bannerModel.updateOne({ _id: bannerId }, {
                $set: {
                    title: title,
                    subtitle: subtitle,
                    description: description,
                    targetUrl: targetedUrl,
                    startDate:startDate ,
                    endDate:endDate,
                }
            })
            res.status(200).json({ message: 'success' })
        }


    } catch (error) {
        console.log(error.message);
    }
}
//block banner
const blockBanner = async (req, res) => {
    try {
        const { id, operation } = req.body
        const bannerData = await bannerModel.findOne({ _id: id })
        if (operation == 'block') {
            bannerData.isActive = false
        } else {
            bannerData.isActive = true
        }
        await bannerData.save()
        res.status(200).json({ message: 'success' })
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadBanner, PostBannerImage, blockBanner, loadEditBanner,
    editBanner
}