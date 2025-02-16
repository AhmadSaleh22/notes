import { Router } from 'express'

const testRouter = Router()

testRouter.get('/', (req, res) => {
  try {
    res.status(200).json({
      message: 'Hello World'
    })
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error'
    })
  }
})

export default testRouter
