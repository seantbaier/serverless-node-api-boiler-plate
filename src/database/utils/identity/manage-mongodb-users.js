import mongoose from 'mongoose'
import connect from '../../config/mongodb'
import { User } from '../../../models'
import logger from '../../../config/logger'

let _client = null

async function init() {
  if (!_client) {
    const result = await connect()
    _client = result.client
  }

  return { client: _client }
}

async function close() {
  if (_client) {
    await _client.connection.close()
    _client = null
  }
}

async function deleteUserByEmail(email) {
  await init()
  logger.info(`Info: Deleting MongoDB User: ${email}`)

  await User.deleteOne({ email })
}

async function deleteTestUsersByEmail(users) {
  const tasks = users.map(async u => {
    await deleteUserByEmail(u.email)
  })

  await Promise.all(tasks)
}

async function createUsers(users) {
  await init()

  const tasks = users.map(async u => {
    logger.info(`Info: Creating MongoDB User: ${u.email}`)

    const user = { ...u }
    user._id = new mongoose.Types.ObjectId(user._id)

    await User.create(user)
    return u
  })

  const results = await Promise.all(tasks)
  await close()

  return results
}

async function updateUsers(users) {
  await init()

  const tasks = users.map(async u => {
    logger.info(`Info: Updating MongoDB User: ${u.emai}`)
    const user = { ...u, password: undefined }
    delete user.password

    user._id = new mongoose.ObjectId(user._id)

    return User.findByIdAndUpdate(user.id, user)
  })

  const results = await Promise.all(tasks)
  await close()

  return results
}

export { updateUsers, createUsers, deleteTestUsersByEmail }
