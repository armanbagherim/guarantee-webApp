"use client";
import * as React from "react";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalaliV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { FormLabel, TextField } from "@mui/material";

// Create RTL cache
const cacheRtl = createCache({
  key: "mui-date-picker-rtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const DatePickerPersian = ({
  date,
  onChange,
  label = null,
  format = "yyyy/MM/dd",
}) => {
  const existingTheme = useTheme();

  const theme = React.useMemo(
    () => createTheme(existingTheme, { direction: "rtl" }),
    [existingTheme]
  );

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <div dir="rtl" className="flex flex-col mb-3">
          {label && (
            <FormLabel className="font-bold text-sm text-gray-600 mb-1 mt-4">
              {label}
            </FormLabel>
          )}
          <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
            <DatePicker
              value={date}
              onChange={(newValue) =>
                onChange(newValue ? newValue.toISOString() : null)
              }
              format={format}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                  variant: "outlined",
                },
                desktopPaper: {
                  dir: "rtl",
                },
                mobilePaper: {
                  dir: "rtl",
                },
              }}
            />
          </LocalizationProvider>
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default DatePickerPersian;
