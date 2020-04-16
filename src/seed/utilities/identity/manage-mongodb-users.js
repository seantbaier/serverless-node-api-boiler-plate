const mongodb = require("mongodb");

// eslint-disable-next-line prefer-destructuring
const connect = require("../../config/mongodb");

let _client = null;
let _db = null;

async function init() {
  if (!_client && !_db) {
    const result = await connect();
    _client = result.client;
    _db = result.db;
  }

  return { client: _client, db: _db };
}

async function close() {
  if (_client) {
    await _client.close();
    _client = null;
    _db = null;
  }
}

async function deleteUserByEmail(email) {
  const { db: database } = await init();

  // eslint-disable-next-line no-console
  console.log("Info: Deleting MongoDB User: ", email);

  await database.collection("users").deleteOne({ email });
}

async function deleteTestUsersByEmail(users) {
  const tasks = users.map(async (u) => {
    await deleteUserByEmail(u.email);
  });

  await Promise.all(tasks);
}

async function createUsers(users) {
  const { db } = await init();

  const tasks = users.map(async (u) => {
    // eslint-disable-next-line no-console
    console.log("Info: Creating MongoDB User:", u.email);
    const user = { ...u, password: undefined };
    delete user.password;

    user._id = new mongodb.ObjectId(user._id);

    await db.collection("users").insertOne(user);
    return u;
  });

  const results = await Promise.all(tasks);
  await close();

  return results;
}

async function updateUsers(users) {
  const { db } = await init();

  const tasks = users.map(async (u) => {
    // eslint-disable-next-line no-console
    console.log("Info: Updating MongoDB User:", u.email);
    const user = { ...u, password: undefined };
    delete user.password;

    user._id = new mongodb.ObjectId(user._id);

    return await db.collection("users").findByIdAndUpdate(user.id, user);
  });

  const results = await Promise.all(tasks);
  await close();

  return results;
}

module.exports = {
  updateUsers,
  createUsers,
};
