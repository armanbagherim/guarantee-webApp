import { TextField, TextFieldVariants } from "@mui/material";
import React from "react";

interface Iinput {
  label: string;
  onChange: () => void;
  error?: boolean;
  loading?: boolean;
  variant?: TextFieldVariants;
  type?: string;
  value?: any;
  onClick?: () => void;
  name?: any;
  helperText: any;
}

const Input = (props: Iinput) => {
  const {
    label,
    onChange,
    error,
    loading,
    variant = "standard",
    type,
    value,
    onClick,
    name,
    helperText,
  } = props;
  return (
    <TextField
      value={value}
      inputProps={{ className: "!text-sm !font-bold !text-gray-600" }}
      type={type}
      InputLabelProps={{ className: "!text-sm !font-bold !text-gray-600" }}
      fullWidth
      variant={variant}
      label={label}
      onChange={onChange}
      error={error}
      onClick={onClick}
      name={name}
      helperText={helperText}
    />
  );
};

export default Input;
