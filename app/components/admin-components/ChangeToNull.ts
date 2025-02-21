const ChangeToNull = (value) => {
  if (typeof value === "string") {
    if (value.trim() === "") {
      return null;
    } else {
      return value;
    }
  } else if (typeof value === "number") {
    return +value;
  } else {
    return null;
  }
};

export default ChangeToNull;
