import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { fetcher } from "../../admin-components/fetcher";
import SearchSelect from "../../admin-components/SearchSelect";

export default function AdditionalData({ data, isAdmin = false }) {
  const [provinces, setProvinces] = useState(null);
  const [cities, setCities] = useState(null);
  const [neighborhoods, setNeighborhoods] = useState(null);

  // Helper function to get field name and value based on isAdmin
  const getFieldValue = (field) => {
    return isAdmin ? data.values.address?.[field] : data.values[field];
  };

  // Fetch provinces only once on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      const res = await fetcher({
        url: `/v1/api/guarantee/client/provinces`,
        method: "GET",
      });
      setProvinces(res.result);
    };
    fetchProvinces();
  }, []);

  // Fetch cities when provinceId changes or is pre-filled in data
  useEffect(() => {
    const provinceId = getFieldValue("provinceId");
    if (provinceId) {
      const fetchCities = async () => {
        const res = await fetcher({
          url: `/v1/api/guarantee/client/cities?provinceId=${provinceId}`,
          method: "GET",
        });
        setCities(res.result);

        // If cityId exists in data, fetch neighborhoods
        const cityId = getFieldValue("cityId");
        if (cityId) {
          const fetchNeighborhoods = async () => {
            const res = await fetcher({
              url: `/v1/api/guarantee/client/neighborhoods?cityId=${cityId}`,
              method: "GET",
            });
            setNeighborhoods(res.result);
          };
          fetchNeighborhoods();
        } else {
          setNeighborhoods(null); // Reset neighborhoods if cityId is not available
        }
      };
      fetchCities();
    } else {
      setCities(null);
      setNeighborhoods(null);
    }
  }, [getFieldValue("provinceId")]);

  // Fetch neighborhoods when cityId changes or is pre-filled in data
  useEffect(() => {
    const cityId = getFieldValue("cityId");
    if (cityId) {
      const fetchNeighborhoods = async () => {
        const res = await fetcher({
          url: `/v1/api/guarantee/client/neighborhoods?cityId=${cityId}`,
          method: "GET",
        });
        setNeighborhoods(res.result);
      };
      fetchNeighborhoods();
    } else {
      setNeighborhoods(null); // Reset neighborhoods if cityId is not available
    }
  }, [getFieldValue("cityId")]);

  const handleSelectChange = (field, value) => {
    const fieldName = isAdmin ? `address.${field}` : field;
    data.setFieldValue(fieldName, value?.id || null);
  };
  // Form fields configuration
  const formFields = [
    { name: "name", label: "نام آدرس" },
    { name: "street", label: "خیابان" },
    { name: "alley", label: "کوچه" },
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
        {provinces && (
          <SearchSelect
            nullable={true}
            onChange={(e) => handleSelectChange("provinceId", e)}
            data={provinces}
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
        {cities && (
          <SearchSelect
            nullable={true}
            onChange={(e) => handleSelectChange("cityId", e)}
            data={cities}
            value={isAdmin ? data.values.address?.cityId : data.values.cityId}
            defaultValue={
              isAdmin ? data.values.address?.cityId : data.values.cityId
            }
            label="شهر"
          />
        )}

        {/* Neighborhood Select */}
        {neighborhoods && neighborhoods.length > 0 && (
          <SearchSelect
            nullable={true}
            onChange={(e) => handleSelectChange("neighborhoodId", e)}
            data={neighborhoods}
            value={
              isAdmin
                ? data.values.address?.neighborhoodId
                : data.values.neighborhoodId
            }
            defaultValue={
              isAdmin
                ? data.values.address?.neighborhoodId
                : data.values.neighborhoodId
            }
            label="محله"
          />
        )}

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
