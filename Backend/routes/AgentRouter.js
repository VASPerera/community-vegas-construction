const express = require('express')
const {agentRegister,agentLogin,forgotPassword,changepassword, getAgentById} = require('../controller/AgentController')

const router = express.Router()

router.post('/register',agentRegister)
router.post('/login',agentLogin)
router.post('/forgotpassword',forgotPassword)
router.post('/change-password/:id/:token',changepassword)
router.get('/get-agent/:id',getAgentById)

module.exports = router