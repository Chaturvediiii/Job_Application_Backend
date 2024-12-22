const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true,'Name is required']
    },
    lastName: { 
        type: String, 
    },
    password: { 
        type: String, 
        required: [true,'Password is required'],
        minlength : [6,'Password length should be atleast 6']
    },
    email: { 
        type: String, 
        required: [true,'Email is required'],
        unique: true ,
        validate : validator.isEmail
    },
    location: { 
        type: String,
        default: 'Bhopal'
    },
  },{timestamps:true});

//   middlewares
  userSchema.pre('save',async function(){
    if(!this.isModified) return ;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
  })

//   JSON WEBTOKEN
  userSchema.methods.createJWT = function(){
    return JWT.sign({userId:this._id},process.env.JWT_SECRET,{expiresIn:'1d'})
  }

  // compare function
  userSchema.methods.comparePassword = async function(userPassword){
    const isMatch = await bcrypt.compare(userPassword,this.password)
    return isMatch
  }
  
  const User = mongoose.model('User', userSchema);
  module.exports = User