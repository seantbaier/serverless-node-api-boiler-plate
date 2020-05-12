import { pick, map } from 'lodash'
import parseBooleanQueryParam from './query-params'
import { convertToObjectId } from './db'

export const escapeRegex = (searchQuery) =>
  searchQuery.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')

export const getIdFilters = (fields, req) => {
  const { query } = req
  return map(pick(query, fields), (val, field) => ({
    [field]: convertToObjectId(val)
  }))
}

export const getListFilters = (fields, req) => {
  const { query } = req
  return map(pick(query, fields), (val, field) => ({
    // eslint-disable-next-line security/detect-non-literal-regexp
    [field]: new RegExp(escapeRegex(val), 'gi')
  }))
}

export const getListNumericFilters = (fields, req) => {
  const { query } = req
  return map(pick(query, fields), (val, field) => ({
    [field]: parseInt(val, 10)
  }))
}

export const getBoolFilters = (fields, req) => {
  const { query } = req
  return map(pick(query, fields), (val, field) => ({
    [field]: parseBooleanQueryParam(val)
  }))
}

export const getFilters = (req, { id, text, numeric, bool }) => {
  let filters = []

  if (id && id.length > 0) {
    filters = filters.concat(getIdFilters(id, req))
  }

  if (text && text.length > 0) {
    filters = filters.concat(getListFilters(text, req))
  }

  if (numeric && numeric.length > 0) {
    filters = filters.concat(getListNumericFilters(numeric, req))
  }

  if (bool && bool.length > 0) {
    filters = filters.concat(getBoolFilters(bool, req))
  }

  return filters
}
