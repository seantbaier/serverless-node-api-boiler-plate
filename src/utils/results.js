import mongoose from "mongoose";

const renameMongoDbFields = (data) => {
  const obj = data instanceof mongoose.Document ? data.toObject() : data;

  if (obj) {
    obj.id = obj._id;
    delete obj._id;

    obj.version = obj.__v;
    delete obj.__v;
  }

  return obj;
};

export default renameMongoDbFields;
