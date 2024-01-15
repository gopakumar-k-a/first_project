const userModel=require('../../models/userModel')

async function generateReferralCode() {
    const isReferralCodeUnique = async (code) => {
        const existingUser = await userModel.findOne({ referralCode: code });
        return !existingUser;
    };

    let referralCode;
    do {
      
        const code = Math.floor(1000 + Math.random() * 9000);
        const randomChars = Math.random().toString(36).substring(2, 4).toUpperCase();
        referralCode = code.toString() + randomChars;
    } while (!(await isReferralCodeUnique(referralCode)));

    return referralCode;
}

async function checkReferredUser(code) {
    const existingUser = await userModel.findOne({ referralCode: code });
    return existingUser; 
}

module.exports={generateReferralCode,checkReferredUser}