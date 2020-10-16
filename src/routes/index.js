import express from 'express'

const router = express.Router()
router.get('/', (req, res) => {
  res.send({ message: 'hello' })
})

router.post('/', (req, res) => {
  res.send({ message: 'ok' })
})

export default router
