"use client";

import React, { useEffect, useState } from "react";
import { TextField, TextFieldProps } from "@mui/material";

interface PriceInputProps {
  label: string;
  name?: string;
  value?: number | string | null;
  onChange: (value: number | null) => void;
  error?: boolean;
  helperText?: React.ReactNode;
  variant?: TextFieldProps["variant"];
  fullWidth?: boolean;
  margin?: TextFieldProps["margin"];
  disabled?: boolean;
  InputLabelProps?: TextFieldProps["InputLabelProps"];
}

const formatWithCommas = (value: string) =>
  value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const toSanitizedDigits = (value: string) => value.replace(/[^\d]/g, "");

const PriceInput: React.FC<PriceInputProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  helperText,
  variant = "outlined",
  fullWidth = true,
  margin = "normal",
  disabled,
  InputLabelProps,
}) => {
  const [displayValue, setDisplayValue] = useState<string>("");

  useEffect(() => {
    if (value === null || value === undefined || value === "") {
      setDisplayValue("");
      return;
    }
    const numericString = toSanitizedDigits(String(value));
    setDisplayValue(numericString ? formatWithCommas(numericString) : "");
  }, [value]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const rawInput = event.target.value;
    const sanitized = toSanitizedDigits(rawInput);
    const formatted = sanitized ? formatWithCommas(sanitized) : "";
    setDisplayValue(formatted);
    onChange(sanitized ? Number(sanitized) : null);
  };

  return (
    <TextField
      value={displayValue}
      label={label}
      name={name}
      onChange={handleChange}
      error={error}
      helperText={helperText}
      variant={variant}
      fullWidth={fullWidth}
      margin={margin}
      disabled={disabled}
      inputProps={{ className: "!text-sm !font-bold !text-gray-600" }}
      InputLabelProps={InputLabelProps || { className: "!text-sm !font-bold !text-gray-600" }}
    />
  );
};

export default PriceInput;
