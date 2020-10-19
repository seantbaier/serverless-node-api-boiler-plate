import express from 'express'
import authRoute from './auth.route'
import userRoute from './user.route'
import docsRoute from './docs.route'

const router = express.Router()

router.use('/auth', authRoute)
router.use('/users', userRoute)
router.use('/docs', docsRoute)

export default router
