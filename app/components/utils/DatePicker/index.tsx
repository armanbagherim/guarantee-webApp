import React from "react";
import DatePicker from "react-multi-date-picker";
import persian_fa from "react-date-object/locales/persian_fa";
import persian from "react-date-object/calendars/persian";

const DatePickerPersian = ({
  date,
  onChange,
  format = "YYYY/MM/DD",
  label = null,
}) => {
  return (
    <div className="flex flex-col mb-3">
      {label && (
        <label className="font-bold text-sm text-gray-600 mb-1 mt-4" htmlFor="">
          {label}
        </label>
      )}

      <DatePicker
        calendar={persian}
        locale={persian_fa}
        format={format}
        value={date}
        calendarPosition="bottom"
        onChange={onChange}
      />
    </div>
  );
};

export default DatePickerPersian;