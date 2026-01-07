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
import { startOfDay } from "date-fns-jalali";

// Create RTL cache
const cacheRtl = createCache({
  key: "mui-date-picker-rtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

type DatePickerPersianProps = {
  date: string | Date | null;
  onChange: (value: string | null) => void;
  label?: string | null;
  format?: string;
  openPast?: boolean;
};

const DatePickerPersian: React.FC<DatePickerPersianProps> = ({
  date,
  onChange,
  label = null,
  format = "yyyy/MM/dd",
  openPast = false, // Added openPast prop with default false
}) => {
  const existingTheme = useTheme();

  const theme = React.useMemo(
    () => createTheme(existingTheme, { direction: "rtl" }),
    [existingTheme]
  );

  const today = startOfDay(new Date());

  const handleDateChange = (newValue) => {
    if (!newValue) return onChange(null);

    // تنظیم ساعت روی 12:00 برای جلوگیری از تبدیل اشتباه به UTC
    const fixedDate = new Date(newValue);
    fixedDate.setHours(12, 0, 0, 0);
    const isoString = fixedDate.toISOString();

    console.log("Fixed ISO Date:", isoString); // برای تست

    onChange(isoString);
  };

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <div dir="rtl" className="flex flex-col mb-3">
          {label && (
            <FormLabel className="font-bold text-sm text-gray-600 mb-1 mt-2">
              {label}
            </FormLabel>
          )}
          <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
            <DatePicker
              showDaysOutsideCurrentMonth={false}
              value={date ? new Date(date) : null}
              onChange={handleDateChange}
              minDate={openPast ? undefined : today} // Conditionally apply minDate
              format={format}
              slotProps={{
                textField: {
                  size: "medium",
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
