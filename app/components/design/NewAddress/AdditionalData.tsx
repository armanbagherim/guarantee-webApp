import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { fetcher } from "../../admin-components/fetcher";
import SearchSelect from "../../admin-components/SearchSelect";

export default function AdditionalData({ data, isAdmin = false, proviences }) {

  // Helper function to get field name and value based on isAdmin
  const getFieldValue = (field) => {
    return isAdmin ? data.values.address?.[field] : data.values[field];
  };


  const handleSelectChange = (field, value) => {
    const fieldName = isAdmin ? `address.${field}` : field;
    data.setFieldValue(fieldName, value?.id || null);
  };
  // Form fields configuration
  const formFields = [
    { name: "name", label: "نام آدرس" },
    { name: "street", label: "خیابان" },
    { name: "plaque", label: "پلاک" },
    { name: "floorNumber", label: "طبقه" },
    { name: "postalCode", label: "کد پستی" },
  ];

  return (
    <div>
      <form
        onSubmit={data.handleSubmit}
        className="grid grid-cols-2 gap-4 request"
      >
        {/* Province Select */}
        {proviences && (
          <SearchSelect
            disabled
            nullable={true}
            onChange={(e) => handleSelectChange("provinceId", e)}
            data={proviences}
            value={
              isAdmin ? data.values.address?.provinceId : data.values.provinceId
            }
            defaultValue={
              isAdmin ? data.values.address?.provinceId : data.values.provinceId
            }
            label="استان"
          />
        )}

        {/* City Select */}


        {/* Render TextFields dynamically */}
        {formFields.map((field) => {
          const fieldName = isAdmin ? `address.${field.name}` : field.name;
          const value = isAdmin
            ? data.values.address?.[field.name] || ""
            : data.values[field.name] || "";

          return (
            <TextField
              key={field.name}
              id={fieldName}
              label={field.label}
              variant="outlined"
              fullWidth
              name={fieldName}
              value={value}
              onChange={data.handleChange}
              onBlur={data.handleBlur}
              error={!!(data.errors[fieldName] && data.touched[fieldName])}
              helperText={data.touched[fieldName] && data.errors[fieldName]}
            />
          );
        })}
      </form>
    </div>
  );
}
