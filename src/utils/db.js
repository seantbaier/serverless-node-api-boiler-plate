import { Schema, model, Types } from 'mongoose';

export const { ObjectId } = Types;

export const convertToObjectId = id => (typeof id === 'string' ? new ObjectId(id) : id);

export const isObjectId = id => ObjectId.isValid(id);

// eslint-disable-next-line max-len
export const createModel = (name, schemaDefinition, schemaOptions, schemaIndex, schemaFunctions) => {
  let mongooseModel = null;

  try {
    mongooseModel = model(name);
  } catch (error) {
    const schema = new Schema(schemaDefinition, schemaOptions);
    if (schemaFunctions) {
      // eslint-disable-next-line no-return-assign
      schemaFunctions.map(sFunc => schema[sFunc.type][sFunc.name] = sFunc.function);
    }
    if (schemaIndex) {
      schema.index(schemaIndex);
    }

    mongooseModel = model(name, schema);
  }

  return mongooseModel;
};
