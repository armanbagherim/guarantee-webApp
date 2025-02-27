import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { fetcher } from "../../admin-components/fetcher";
import SearchSelect from "../../admin-components/SearchSelect";

export default function AdditionalData({ data }) {
  const [provinces, setProvinces] = useState(null);
  const [cities, setCities] = useState(null);
  const [neighborhoods, setNeighborhoods] = useState(null);

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

  useEffect(() => {
    if (data.values.provinceId) {
      const fetchCities = async () => {
        const res = await fetcher({
          url: `/v1/api/guarantee/client/cities?provinceId=${data.values.provinceId}`,
          method: "GET",
        });
        setCities(res.result);
        data.setFieldValue("cityId", null);
        data.setFieldValue("neighborhoodId", null);
      };
      fetchCities();
    } else {
      setCities(null);
      setNeighborhoods(null);
    }
  }, [data.values.provinceId]);

  useEffect(() => {
    if (data.values.cityId) {
      const fetchNeighborhoods = async () => {
        const res = await fetcher({
          url: `/v1/api/guarantee/client/neighborhoods?cityId=${data.values.cityId}`,
          method: "GET",
        });
        setNeighborhoods(res.result);
        data.setFieldValue("neighborhoodId", null);
      };
      fetchNeighborhoods();
    } else {
      setNeighborhoods(null);
    }
  }, [data.values.cityId]);

  const handleSelectChange = (field, value) => {
    data.setFieldValue(field, value?.id || null);
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
            value={data.values.provinceId}
            isDiff={true}
            diffName="name"
            label="استان"
          />
        )}

        {/* City Select */}
        {cities && (
          <SearchSelect
            nullable={true}
            onChange={(e) => handleSelectChange("cityId", e)}
            data={cities}
            value={data.values.cityId}
            isDiff={true}
            diffName="name"
            label="شهر"
          />
        )}

        {/* Neighborhood Select */}
        {neighborhoods && (
          <SearchSelect
            nullable={true}
            onChange={(e) => handleSelectChange("neighborhoodId", e)}
            data={neighborhoods}
            value={data.values.neighborhoodId}
            label="محله"
          />
        )}

        {/* Render TextFields dynamically */}
        {formFields.map((field) => (
          <TextField
            key={field.name}
            id={field.name}
            label={field.label}
            variant="outlined"
            fullWidth
            name={field.name}
            value={data.values[field.name] || ""}
            onChange={data.handleChange}
            onBlur={data.handleBlur}
            error={!!(data.errors[field.name] && data.touched[field.name])}
            helperText={data.touched[field.name] && data.errors[field.name]}
          />
        ))}
      </form>
    </div>
  );
}
