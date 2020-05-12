import express from 'express'
import UserController from '../../controllers/UserController'

const router = express.Router()

router.get('/', UserController.getMany)
router.get('/:id', UserController.getOne)

export default router
