import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { isEmpty } from 'validator'

import { ValidationError } from './errors'
import * as AWS from './aws'

export const parsePhoneNumber = (value) => {
  if (typeof value === 'undefined') {
    return undefined
  }

  if (!value || isEmpty(value.trim())) {
    return null
  }

  const parsedData = parsePhoneNumberFromString(value, 'US')
  if (!parsedData) {
    throw new ValidationError('Invalid phone number format', 400)
  }

  return parsedData.number
}

export const parseUrlOrUpload = async (value, path) => {
  let url = value

  if (value !== null) {
    switch (typeof value) {
      case 'object': {
        const result = await AWS.uploadImage(path, new Date().getTime(), value)
        url = result.Location
        break
      }
      case 'string': {
        const trimmedValue = value.trim()
        if (trimmedValue !== '') {
          url = trimmedValue
        } else {
          url = null
        }

        break
      }
      default:
        url = null
    }
  }

  return url
}
