import { isMongoId, isEmail } from 'validator'
import { convertToObjectId } from './db'

const getLookupQuery = (id) => {
  const query = { isActive: true }

  if (isMongoId(id)) {
    query._id = convertToObjectId(id)
  } else if (isEmail(id)) {
    query.email = id
  } else {
    query.externalId = id
  }

  return query
}

export default getLookupQuery
