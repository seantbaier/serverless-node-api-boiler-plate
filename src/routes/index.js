const express = require('express')
const authRoute = require('./auth')
const userRoute = require('./user')
const docsRoute = require('./docs')

const router = express.Router()

router.use('/auth', authRoute)
router.use('/auth/users', userRoute)
router.use('/docs', docsRoute)

module.exports = router
