interface Values {
  [key: string]: any; // Keys are strings and values can be of any type
}

export const ConvertToNull = (
  values?: Values | null,
  keysToIgnore: string[] = []
): Values => {
  const result: Values = { ...(values || {}) }; // Use an empty object if values is undefined or null

  for (const key in result) {
    if (result.hasOwnProperty(key) && !keysToIgnore.includes(key)) {
      if (result[key] === "") {
        result[key] = null; // Convert empty string to null
      }
    }
  }

  return result;
};
