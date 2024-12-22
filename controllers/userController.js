const User = require("../models/userModel")

const updateUserController = async (req,res,next) =>{
    const {name,lastName,email,location} = req.body
    if(!name || !lastName || !email || !location){
        next('Provide all the fields')
    }
    const user = await User.findOne({_id:req.user.userId})
    user.name = name
    user.lastName = lastName
    user.email = email
    user.location = location

    await user.save()
    const token = user.createJWT();
    res.status(200).json({user,token})
}

const getUserController = async (req,res,next) =>{
    try{
        const user = await User.findById({_id:req.body.user.userId})
        user.password = undefined
        if(!user) return res.status(200).json({
            message : 'User not found',
            success : false,
        })
        else{
            res.status(200).json({
                success:true,
                date: user
            })
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message :'Auth error',
            success: false,
            error : error.message
        })
    }
}

module.exports = {updateUserController,getUserController}