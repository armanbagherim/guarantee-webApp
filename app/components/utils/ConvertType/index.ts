type ConvertType = 'number' | 'string' | 'boolean';

export const convertValue = (value: string | number | boolean, type: ConvertType): string | number | boolean => {
  switch (type) {
    case 'number':
      return value ? Number(value) : '';
    case 'string':
      return String(value);
    case 'boolean':
      return value === 'true';
    default:
      return value; // برای انواع دیگر، مقدار را بدون تغییر برمی‌گرداند
  }
}