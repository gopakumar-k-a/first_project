const bcrypt = require('bcryptjs');


const hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        console.log(error.message);

    }

};

module.exports=hashPassword