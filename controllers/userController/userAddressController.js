

const addAddress=async(req,res)=>{
    try {
        console.log(req.body);
        const {firstName,lastName,Phone,altPhone,houseName,
        city,state,pincode,landMark}=req.body
    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
    addAddress
}