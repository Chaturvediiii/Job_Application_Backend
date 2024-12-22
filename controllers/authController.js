const User = require("../models/userModel")

const registerController = async (req,res,next) =>{
        const {name,email,lastName,location,password} = req.body

        const user =  await User.create({name,lastName,email,password,location})
        const token = user.createJWT()
        res.status(201).json({
                success: true,
                user:{
                name : user.name,
                lastName: user.lastName,
                email: user.email,
                location : user.location
        },token})
}

const loginController = async (req,res,next)=>{
        const {email,password} = req.body;
        if(!email || !password) next('Please provide required fields')

        const user = await User.findOne({email});
        if(!user) next('Incorrect username or password')

        const isMatch = await user.comparePassword(password);
        if(!isMatch) next('Incorrect username or password');

        const token = user.createJWT()
        res.status(200).json({
                success: true,
                user:{
                name : user.name,
                lastName: user.lastName,
                email: user.email,
                location : user.location},token})
}

module.exports = {registerController,loginController}