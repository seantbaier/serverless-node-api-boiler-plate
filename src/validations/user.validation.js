const Joi = require('@hapi/joi')
const { password, objectId } = require('./custom.validation')

const createUser = {
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .required()
      .custom(password),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string()
      .required()
      .valid('user', 'admin'),
  }),
}

const getUsers = {
  query: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
}

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
}

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      firstName: Joi.string(),
      lastName: Joi.string(),
    })
    .min(1),
}

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
}

export { createUser, getUsers, getUser, updateUser, deleteUser }
