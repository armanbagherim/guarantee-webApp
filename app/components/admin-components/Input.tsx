import { TextField, TextFieldVariants, TextFieldProps } from "@mui/material";
import React from "react";

interface Iinput {
  label: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  error?: boolean;
  loading?: boolean;
  variant?: TextFieldVariants;
  type?: string;
  value?: any;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
  name?: string;
  helperText?: React.ReactNode;
  fullWidth?: boolean;
  margin?: TextFieldProps["margin"];
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
    fullWidth = true,
    margin = "none",
  } = props;
  return (
    <TextField
      value={value}
      inputProps={{ className: "!text-sm !font-bold !text-gray-600" }}
      type={type}
      InputLabelProps={{ className: "!text-sm !font-bold !text-gray-600" }}
      fullWidth={fullWidth}
      margin={margin}
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
