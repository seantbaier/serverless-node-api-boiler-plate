/**
 * User model
 */

import { isEmpty, isEmail } from 'validator'
import { createModel } from '../utils/db'

export default createModel(
  'Users',
  {
    externalId: {
      type: String,
      unique: true
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: (value) => isEmail(value),
        message: (props) => `${props.value} is not a valid email!`
      }
    },
    firstName: {
      type: String,
      required: true,
      validate: {
        validator: (value) => !isEmpty(value, { ignore_whitespace: true }),
        message: (props) => `${props.value} cannot be empty!`
      }
    },
    lastName: {
      type: String,
      required: true,
      validate: {
        validator: (value) => !isEmpty(value, { ignore_whitespace: true }),
        message: (props) => `${props.value} cannot be empty!`
      }
    },
    role: {
      type: String,
      enum: ['System Administrator'],
      default: 'System Administrator'
    },
    isActive: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  { timestamps: true },
  [
    {
      type: 'statics',
      name: 'getFullName',
      async function(id) {
        const self = this

        const user = await self.findById(id)

        if (user) {
          return `${user.firstName} ${user.lastName}`
        }
        return null
      }
    }
  ]
)
