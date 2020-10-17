import mongoose from 'mongoose'
import config from './config/config'

const mongoDB = `${config.mongoose.url}/${process.dbName}?retryWrites=true&w=majority`

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = global.Promise
const db = mongoose.connection

// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

export default db
