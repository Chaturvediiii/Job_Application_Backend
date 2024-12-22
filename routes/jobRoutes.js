const express = require('express');
const userAuth = require('../middlewares/authMiddleware');
const {createJobController,getAllJobs, updateJobController,deleteJobController, jobStatsController} = require('../controllers/jobController');
const router = express.Router();

router.post('/create-job',userAuth,createJobController);

router.get('/get-jobs',userAuth,getAllJobs)

router.put('/update-job/:id',userAuth,updateJobController)

router.delete('/delete-job/:id',userAuth,deleteJobController)

router.get('/job-stats',userAuth,jobStatsController)

module.exports = router;