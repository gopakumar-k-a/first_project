const nodemailer = require('nodemailer');

//random otp generate function
function generateOTP() {
    // Generate a random number between 100000 (inclusive) and 999999 (exclusive)
    return Math.floor(100000 + Math.random() * 900000).toString();
}

//node mailer function for sending otp to mail
const sendOtp = async (email, otp) => {
    try {



        console.log('generated OTP' + otp)

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'OTP For your verification',
            html: `<h style="color: blue;">Enter this OTP to register on jersy man</h>
            <p>Your OTP is: <strong>${otp}</strong></p>`
        };

        transporter.sendMail(mailOptions)
            .then((info) => {
                console.log('Email sent:', info.response);
            })
            .catch((error) => {
                console.error('Error sending email:', error.message);
            });
    } catch (error) {
        console.log(error.message);
    }
}
module.exports={
    generateOTP,sendOtp
}