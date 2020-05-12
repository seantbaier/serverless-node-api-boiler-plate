const cognito = require('./utilities/identity/manage-cognito-users')
const mongodb = require('./utilities/identity/manage-mongodb-users')
const data = require('./data/entities/seed')

;(async () => {
  try {
    const cognitoUsers = await cognito.createUsers(data.users)
    await mongodb.createUsers(cognitoUsers)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err)
  }
})()
