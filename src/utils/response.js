import { isArray } from "lodash";

export const makeUpdatedResponse = (original, updated) => ({
  data: {
    original,
    updated,
  },
});

export const makeArray = (req, data, itemCount) => {
  const {
    query: { limit, skip = 0, page = 1 },
  } = req;
  const currentPage = page > 1 ? page : 1 + Math.ceil(skip / limit);
  const pageCount = Math.ceil(itemCount / limit);

  return {
    object: "list",
    has_more: currentPage < pageCount,
    data,
    pageCount,
    currentPage,
    totalItems: itemCount,
  };
};

export const makeObject = (req, data) => ({
  object: "object",
  data,
});

export const makePaginatedResponse = (req, data, itemCount) => {
  if (isArray(data)) {
    return makeArray(req, data, itemCount);
  }

  // must be object
  return makeObject(req, data);
};
