const mongodb = require("mongodb");
require("dotenv").config();

module.exports = async function connect() {
  const options = { useNewUrlParser: true, useUnifiedTopology: true };
  const client = await mongodb.MongoClient.connect(
    process.env.MONGODB_URI,
    options
  );
  const db = client.db(process.env.PROJECT_NAME);
  db.close = client.close;

  return {
    client,
    db,
  };
};
