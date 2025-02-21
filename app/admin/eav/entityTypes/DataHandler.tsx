import React, { useState } from "react";
import ModalSelect from "@/app/components/admin-components/ModalSelect";
import { Autocomplete, Chip, CircularProgress, TextField } from "@mui/material";
import Map from "@/app/components/admin-components/Map";
import Modal from "@/app/components/admin-components/Modal";
import Input from "@/app/components/admin-components/Input";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import dynamic from "next/dynamic";
import { convertValue } from "@/app/components/utils/ConvertType";

const SeoBox = dynamic(
  () => import("@/app/admin/ecommerce/products/_components/SeoBox"),
  { ssr: false }
);

const DataHandler = ({
  isOpen,
  setIsOpen,
  loading,
  formik,
  parentEntityTypes,
  parentEntityTypesIsLoading,
  setIsEdit,
}) => {
  const [value, setValue] = React.useState("1");
  const [operatorsOpen, setOperatorsOpen] = useState(false);
  const [citiesOpen, setCitiesOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Modal
      loading={loading}
      title="افزودن / ویراش دسته بندی"
      handleClose={() => {
        formik.resetForm();
        setIsOpen(false);
        setIsEdit({ active: false, id: null });
      }}
      maxSize="sm"
      isOpen={isOpen}
      handleAccept={formik.handleSubmit}
    >
      <form className="pt-4" onSubmit={formik.handleSubmit}>
        <div className="flex gap-4 mb-4">
          <Input
            onChange={formik.handleChange}
            variant="outlined"
            value={formik.values.name}
            label="نام دسته"
            name="name"
            error={
              formik?.errors?.name && formik?.touched?.name
                ? formik?.errors?.name
                : null
            }
            helperText={formik?.touched?.name && formik?.errors?.name}
          />
          <Input
            onChange={formik.handleChange}
            variant="outlined"
            value={formik.values.slug}
            label="لینک"
            name="slug"
            error={
              formik?.errors?.slug && formik?.touched?.slug
                ? formik?.errors?.slug
                : null
            }
            helperText={formik?.touched?.slug && formik?.errors?.slug}
          />
        </div>

        <div className="flex gap-4 mb-4">
          <Input
            onChange={formik.handleChange}
            variant="outlined"
            value={formik.values.metaTitle}
            label="عنوان سئو"
            name="metaTitle"
            error={
              formik?.errors?.metaTitle && formik?.touched?.metaTitle
                ? formik?.errors?.metaTitle
                : null
            }
            helperText={formik?.touched?.metaTitle && formik?.errors?.metaTitle}
          />
          <Input
            onChange={formik.handleChange}
            variant="outlined"
            value={formik.values.metaDescription}
            label="توضیحات سئو"
            name="metaDescription"
            error={
              formik?.errors?.metaDescription &&
              formik?.touched?.metaDescription
                ? formik?.errors?.metaDescription
                : null
            }
            helperText={
              formik?.touched?.metaDescription &&
              formik?.errors?.metaDescription
            }
          />
        </div>
        <div className="flex gap-4 mb-4">
          <Input
            onChange={formik.handleChange}
            variant="outlined"
            value={formik.values.metaKeywords}
            label="کلمات کلیدی"
            name="metaKeywords"
            error={
              formik?.errors?.metaKeywords && formik?.touched?.metaKeywords
                ? formik?.errors?.metaKeywords
                : null
            }
            helperText={
              formik?.touched?.metaKeywords && formik?.errors?.metaKeywords
            }
          />
          <Input
            onChange={(e) =>
              formik.setFieldValue(
                "priority",
                convertValue(e.target.value, "number")
              )
            }
            type="number"
            variant="outlined"
            value={formik.values.priority}
            label="اولویت"
            name="priority"
            error={
              formik?.errors?.priority && formik?.touched?.priority
                ? formik?.errors?.priority
                : null
            }
            helperText={formik?.touched?.priority && formik?.errors?.priority}
          />
        </div>
        <div>
          <FormControl
            fullWidth
            variant="outlined"
            className="!mt-0 !pt-0 !mb-4"
          >
            <Autocomplete
              options={parentEntityTypes?.result.flatMap((value) => [
                { id: value.id, name: value.name, isParent: true },
                ...value.subEntityTypes.map((sub) => ({
                  id: sub.id,
                  name: `${sub.name}`,
                  isParent: false,
                })),
              ])}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                formik.setFieldValue(
                  "parentEntityTypeId",
                  newValue ? newValue.id : null
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="دسته پدر"
                  variant="outlined"
                  margin="normal"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {parentEntityTypesIsLoading ? (
                          <CircularProgress size={24} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              value={
                parentEntityTypes?.result
                  .flatMap((value) => [
                    { id: value.id, name: value.name, isParent: true },
                    ...value.subEntityTypes.map((sub) => ({
                      id: sub.id,
                      name: `${sub.name}`,
                      isParent: false,
                    })),
                  ])
                  .find(
                    (option) => option.id === formik.values.parentEntityTypeId
                  ) || null
              } // اصلاح شده
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.name}
                  {option.isParent && (
                    <span className="bg-blue-700 mx-2 text-white px-3 py-2 rounded-lg text-sm font-bold">
                      دسته پدر
                    </span>
                  )}
                </li>
              )}
              style={{ marginTop: 8 }}
            />
          </FormControl>
        </div>

        <div>
          <SeoBox
            setDescription={(value) =>
              formik.setFieldValue("description", value)
            }
            description={formik.values.description}
            disabled={false}
          />{" "}
        </div>
      </form>
    </Modal>
  );
};

export default DataHandler;
