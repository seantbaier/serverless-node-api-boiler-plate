/* eslint-disable */

// Disabling linting since the db object is coming in from docker
// This is only ran when running docker-compose.local.yml

db.createUser({
  user: 'studiosauce',
  pwd: 'studiosauce',
  roles: [
    {
      role: 'readWrite',
      db: 'studiosauce',
    },
  ],
})

const collections = ['users']

const createCollections = async () => {
  const promises = collections.map(async c => {
    return db.createCollection(c)
  })

  await Promise.all(promises).then(() => {
    client.close()
  })
}

createCollections()
