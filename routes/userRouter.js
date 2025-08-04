const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')

router.post('/login',userController.userLogin)
router.post('/signup',userController.registerUser)

module.exports=router