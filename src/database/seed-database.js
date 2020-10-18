import data from './data/seed'
import * as mongodb from './utils/identity/manage-mongodb-users'

const createUsers = async () => {
  try {
    // const cognitoUsers = await cognito.createUsers(data.users)
    await mongodb.createUsers(data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err)
  }
}

createUsers()

export default createUsers
