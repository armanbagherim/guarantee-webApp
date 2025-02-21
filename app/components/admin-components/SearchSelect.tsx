import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

// Assuming data is an array of objects with id and name properties
// Helper function to safely access nested properties
const getNestedProperty = (obj, path, defaultValue = undefined) => {
  const parts = path.split(".");
  let current = obj;
  for (let i = 0; i < parts.length; i++) {
    if (current[parts[i]] === undefined) {
      return defaultValue;
    }
    current = current[parts[i]];
  }
  return current;
};

const formatOptions = (data, isDiff, diffName, nullable, diffKey) => {
  if (nullable) {
    data = [{ [diffKey]: null, name: "بدون انتخاب" }, ...data];
  }
  return data?.map((item) => ({
    [diffKey]: item[diffKey],
    name: isDiff ? getNestedProperty(item, diffName) : item.name,
  }));
};

export default function SearchSelect({
  loadingState,
  data,
  isDiff,
  onChange,
  label,
  value,
  diffName,
  nullable,
  defaultValue,
  diffKey = "id", // default diffKey is 'id'
  disabled = false,
}) {
  const [currentValue, setCurrentValue] = useState(defaultValue);

  useEffect(() => {
    setCurrentValue(defaultValue);
  }, [defaultValue]);

  if (loadingState) {
    return (
      <div className="flex-1">
        <TextField
          disabled
          id="first_name"
          label={label}
          variant="outlined"
          fullWidth
        />
      </div>
    );
  }

  const options = formatOptions(data, isDiff, diffName, nullable, diffKey);

  // Ensure the currentValue matches one of the options
  const currentValueObject =
    options.find((option) => option[diffKey] === currentValue) || null;

  return (
    <div className="flex-1">
      <Autocomplete
        disabled={disabled}
        id="first_name"
        options={options}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField
            disabled={disabled}
            {...params}
            label={label}
            variant="outlined"
            fullWidth
          />
        )}
        onChange={(event, newValue) => {
          setCurrentValue(newValue ? newValue[diffKey] : null);
          onChange(newValue ? newValue : null);
        }}
        value={currentValueObject} // Ensure this matches one of the options
      />
    </div>
  );
}
