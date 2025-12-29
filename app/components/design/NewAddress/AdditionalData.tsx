import { CircularProgress, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { fetcher } from "../../admin-components/fetcher";
import SearchSelect from "../../admin-components/SearchSelect";

interface AdditionalDataProps {
  data: any;
  isAdmin?: boolean;
  proviences: any[];
  disabled?: boolean;
}

export default function AdditionalData({ data, isAdmin = false, proviences, disabled = false }: AdditionalDataProps) {
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);

  // Helper function to get field name and value based on isAdmin
  const getFieldValue = (field: string) => {
    return isAdmin ? data.values.address?.[field] : data.values[field];
  };

  const handleSelectChange = async (field: string, value: any) => {
    const fieldName = isAdmin ? `address.${field}` : field;
    data.setFieldValue(fieldName, value?.id || null);

    // If province is changed, reset city and fetch new cities
    if (field === 'provinceId' && value?.id) {
      data.setFieldValue(isAdmin ? 'address.cityId' : 'cityId', null);
      await fetchCities(value.id);
    }
  };

  const fetchCities = async (provinceId: any) => {
    if (!provinceId) {
      setCities([]);
      return;
    }

    try {
      setLoadingCities(true);
      const result = await fetcher({
        url: `/v1/api/guarantee/client/cities?provinceId=${provinceId}`,
        method: 'GET',
      });
      setCities(Array.isArray(result) ? result : (result?.result || []));
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  };

  // Fetch cities when component mounts or when provinceId changes
  useEffect(() => {
    const provinceId = isAdmin ? data.values.address?.provinceId : data.values.provinceId;
    if (provinceId) {
      fetchCities(provinceId);
    } else {
      setCities([]);
    }
  }, [isAdmin ? data.values.address?.provinceId : data.values.provinceId]);
  // Form fields configuration
  const formFields = [
    { name: "name", label: "نام آدرس برای مثال خانه یا شرکت" },
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
            disabled={disabled}
            nullable={true}
            onChange={async (e: any) => handleSelectChange('provinceId', e)}
            data={proviences}
            value={getFieldValue('provinceId')}
            label="استان"
            defaultValue={null}
            loadingState={null}
            isDiff={false}
            diffName="name"
          />
        )}

        {/* City Select */}
        <div className="relative">
          <SearchSelect
            disabled={disabled}
            loadingState={loadingCities}
            nullable={true}
            onChange={async (e: any) => handleSelectChange('cityId', e)}
            data={cities}
            value={getFieldValue('cityId')}
            label="شهر"
            defaultValue={null}
            isDiff={false}
            diffName="name"
          />
          {loadingCities && (
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
              <CircularProgress size={20} />
            </div>
          )}
        </div>


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
