const concat = (address) => {
  const parts = [];
  if (address?.province?.name) {
    parts.push(`استان: ${address?.province?.name}`);
  }
  if (address?.city?.name) {
    parts.push(`شهر: ${address?.city?.name}`);
  }

  if (address?.street) {
    parts.push(`خیابان: ${address.street}`);
  }
  if (address?.alley) {
    parts.push(`کوچه: ${address.alley}`);
  }
  if (address?.plaque) {
    parts.push(`پلاک: ${address.plaque}`);
  }
  if (address?.floorNumber) {
    parts.push(`طبقه: ${address.floorNumber}`);
  }
  return parts.join("، ");
};

export default concat;
