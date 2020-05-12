import Joi from '@hapi/joi'

import JoiNotWhitespace from './extensions/joi-not-whitespace'

const CustomJoi = Joi.extend(JoiNotWhitespace)

const CreateSchema = Joi.object({
  email: Joi.string().email().required(),
  password: CustomJoi.string()
    .notWhitespace()
    .min(8)
    .regex(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/, { name: 'password policy' })
    .allow('', null),
  firstName: CustomJoi.string().notWhitespace().min(2).required(),
  lastName: CustomJoi.string().notWhitespace().min(2).required(),
  role: CustomJoi.string().valid('System Administrator'),
  isActive: Joi.boolean().default(true)
}).unknown(true)

const UpdateSchema = CreateSchema.append({
  password: Joi.string().forbidden(),
  externalId: CustomJoi.string().guid().required(),
  version: Joi.number().required()
})

const PatchSchema = Joi.object({
  firstName: CustomJoi.string().notWhitespace().min(2).optional(),
  lastName: CustomJoi.string().notWhitespace().min(2).optional(),
  role: CustomJoi.string().valid('System Administrator').optional(),
  isActive: Joi.boolean().optional()
})

export { CreateSchema, UpdateSchema, PatchSchema }
