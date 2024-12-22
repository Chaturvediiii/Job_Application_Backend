const express = require('express');
const userAuth = require('../middlewares/authMiddleware');
const {updateUserController,getUserController} = require('../controllers/userController');
const router = express.Router()

router.post('/getUser',userAuth,getUserController)


router.put('/update-user',userAuth,updateUserController)

module.exports = router