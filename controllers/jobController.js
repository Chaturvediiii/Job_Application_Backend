const Job = require("../models/jobModel");
const mongoose = require('mongoose')
const moment = require('moment')

const createJobController = async (req,res,next) =>{
    const {company,position} = req.body;
    if(!company || !position) next('Please provide all fields')

    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body)
    res.status(201).json({job})
}

const getAllJobs = async  (req,res,next) =>{
    const {status,workType,search,sort} = req.query
    const queryObject = {
        createdBy : req.user.userId
    }
    if(status && status!=='all') queryObject.status = status
    if(workType && workType!=='all') queryObject.workType = workType
    if(search) queryObject.position = {$regex:search, $options: 'i'}
    
    let queryResult  = Job.find(queryObject);
    if(sort==='latest') queryResult = queryResult.sort('-createdAt')
    if(sort==='oldest') queryResult = queryResult.sort('createdAt')
    if(sort==='a-z') queryResult = queryResult.sort('-psoition')

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page-1)*limit

    queryResult =queryResult.skip(skip).limit(limit)
    const totalJobs = await Job.countDocuments(queryResult)
    const numOfPage = Math.ceil(totalJobs/limit);

    const jobs = await queryResult
    res.status(200).json({totalJobs,jobs,numOfPage})
}

const updateJobController = async (req,res,next) =>{
    const {id} = req.params;
    const {company,position} = req.body;
    if(!company || !position) next('Provide all the fields');

    const job = await Job.findOne({_id:id})
    if(!job) next(`No job found with this id ${id}`);

    if(!(req.user.userId===job.createdBy.toString())){
        next('You are not authorized to update');
        return;
    } 
        

    const updateJob = await Job.findOneAndUpdate({_id:id},req.body,{
        new: true,
        runValidators: true
    })
    res.status(200).json(updateJob)
}

const deleteJobController = async(req,res,next) =>{
    const {id} = req.params;
    const job = await Job.findById({_id:id})
    if(!job) next(`No job found with this ${id}`)

    if(!(req.user.userId===job.createdBy.toString())){
        next('You are not authorized to update');
        return;
    } 

    await job.deleteOne()
    res.status(200).json("Deleted successfully")
}

const jobStatsController = async (req,res) =>{
    const stats = await Job.aggregate([
        {
            $match : {
                createdBy : new mongoose.Types.ObjectId(req.user.userId)
            },
        },
        {
            $group :{
                _id : '$status',
                count:{$sum:1}
            }
        }
    ])
    const defaultStats = {
        pending : stats.pending || 0,
        reject : stats.reject || 0,
        interview : stats.interview || 0
    }

    let monthlyApplication = await Job.aggregate([
        {
            $match:{
                createdBy : new mongoose.Types.ObjectId(req.user.userId)
            }
        },
        {
            $group:{
                _id : {
                    year : {$year : '$createdAt'},
                    month : {$month : '$createdAt'}
                },
                count :{
                    $sum : 1,
                }
            }
        }
    ])
    monthlyApplication = monthlyApplication.map(item=>{
        const { _id:{year,month},count} = item
        const date  = moment().month(month-1).year(year).format('MMM Y')
        return {date,count}
    })
    res.status(200).json({totalJobs : stats.length, defaultStats,monthlyApplication})
}

module.exports = {createJobController,getAllJobs,updateJobController,deleteJobController,jobStatsController}