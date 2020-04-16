const parseBooleanQueryParam = (value, defaultValue = false) => {
  if (typeof value === 'undefined' || value === null) {
    return defaultValue;
  }

  const escapedValue = value.toString().trim()
    .toUpperCase();

  if (['1', 'TRUE', 'YES'].includes(escapedValue)) {
    return true;
  }

  if (['0', 'FALSE', 'NO'].includes(escapedValue)) {
    return false;
  }

  return defaultValue;
};


export default parseBooleanQueryParam;
