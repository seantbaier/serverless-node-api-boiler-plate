import mongoose from 'mongoose';

const mongoDB = `${process.env.MONGODB_URI}/${process.env.PROJECT_NAME}?retryWrites=true&w=majority`;

mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export default db;
