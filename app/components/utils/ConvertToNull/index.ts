interface Values {
  [key: string]: any;
}

const isObject = (value: any): value is object => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

const normalizePhoneNumber = (value: string): string => {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  
  return value.replace(/[۰-۹٠-٩]/g, (d) => {
    const persianIndex = persianNumbers.indexOf(d);
    if (persianIndex !== -1) return persianIndex.toString();
    const arabicIndex = arabicNumbers.indexOf(d);
    if (arabicIndex !== -1) return arabicIndex.toString();
    return d;
  });
};

const normalizeNumbers = (value: any): any => {
  if (typeof value === 'string') {
    // Convert Persian/Arabic numbers to English for all strings
    const normalizedValue = normalizePhoneNumber(value);
    
    // Convert empty string to null
    if (normalizedValue.trim() === '') {
      return null;
    }
    
    return normalizedValue;
  }
  return value;
};

const processNestedObject = (obj: Values): Values => {
  const result: Values = { ...obj };
  
  for (const key in result) {
    if (result.hasOwnProperty(key)) {
      if (isObject(result[key])) {
        result[key] = processNestedObject(result[key]);
      } else {
        result[key] = normalizeNumbers(result[key]);
      }
    }
  }
  
  return result;
};

export const ConvertToNull = (
  values?: Values | null,
  keysToIgnore: string[] = []
): Values => {
  if (!values) return {};
  
  const result = processNestedObject(values);
  
  // Restore original values for keys to ignore
  for (const key of keysToIgnore) {
    if (key in result) {
      result[key] = values[key];
    }
  }
  
  return result;
};