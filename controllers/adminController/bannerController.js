const bannerModel = require('../../models/bannerModel')


const loadBanner = async (req, res) => {
    try {
        const bannerData = await bannerModel.find({})
        res.render('admin/banner', { bannerData })
    } catch (error) {
        console.log(error.message);
    }
}

const PostBannerImage = async (req, res) => {
    try {
        console.log('this is body', req.body);
        const { name, title, subtitle,
            description, targetedUrl, startDate, endDate } = req.body

        let image = ''
        if (req.file) {
            image = req.file.filename
            console.log('this is file', image);

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

            // Introduce a delay of 500 milliseconds (adjust as needed)
            setTimeout(() => {
                if (req.xhr) {
                    // If it's an XMLHttpRequest (AJAX) request, send a JSON response
                    res.status(200).json({ message: 'success' });
                } else {
                    // If it's a regular form submission, you can redirect
                    res.redirect('/admin/banner'); // Adjust the redirect URL as needed
                }
            }, 500);
        }




    } catch (error) {
        console.log(error.message);
    }
}

module.exports = { loadBanner, PostBannerImage }