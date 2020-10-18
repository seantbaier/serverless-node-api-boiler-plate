import mongoose from 'mongoose'
import config from '../../config/config'

async function connect() {
  const options = { useNewUrlParser: true, useUnifiedTopology: true }
  const client = await mongoose.connect(
    `${config.mongoose.url}/${config.mongoose.dbName}?retryWrites=true&w=majority`,
    options
  )

  return {
    client,
  }
}

export default connect
