import mongoose from 'mongoose'
import serverless from 'serverless-http'
import app from './app'
import config from './config/config'
import logger from './config/logger'

let server
mongoose
  .connect(
    `${config.mongoose.url}/${config.mongoose.dbName}?retryWrites=true&w=majority`,
    config.mongoose.options
  )
  .then(() => {
    logger.info('Connected to MongoDB')
    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`)
    })
  })

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed')
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
}

const unexpectedErrorHandler = error => {
  logger.error(error)
  exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
  logger.info('SIGTERM received')
  if (server) {
    server.close()
  }
})

const handler = serverless(app, async (event, context) => {
  // you can access lamabda context and event here
  const result = await handler(event, context)
  // and here
  return result
})

// eslint-disable-next-line import/prefer-default-export
export { handler }
