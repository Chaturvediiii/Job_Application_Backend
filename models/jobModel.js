const mongoose = require('mongoose')
const validator = require('validator')

const jobSchema = new mongoose.Schema({
    company: { 
        type: String, 
        required: [true,'Company name is required']
    },
    position: { 
        type: String, 
        required: [true,'Job position is required'],
        maxlength : 100,
    },
    status: { 
        type: String, 
        enum : ['reject','pending','interview'],
        default : 'pending'
    },
    workType: { 
        type: String, 
        enum : ['Full-time','Part-time','Internship'],
        default : 'Full-time'
    },
    workLocation: { 
        type: String,
        default: 'Bhopal',
        required: [true,'Location is required']
    },
    createdBy : {
        type:mongoose.Types.ObjectId,
        ref: 'User'
    }
  },{timestamps:true});

  const Job = mongoose.model('Job', jobSchema);
  module.exports = Job