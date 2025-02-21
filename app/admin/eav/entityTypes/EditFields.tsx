import React, { useState } from "react";
import ModalSelect from "@/app/components/admin-components/ModalSelect";
import { Autocomplete, Chip, CircularProgress, TextField } from "@mui/material";
import Map from "@/app/components/admin-components/Map";
import Modal from "@/app/components/admin-components/Modal";
import Input from "@/app/components/admin-components/Input";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import dynamic from "next/dynamic";
import { convertValue } from "@/app/components/utils/ConvertType";
import { useFetcher } from "@/app/components/admin-components/fetcher";

const SeoBox = dynamic(
  () => import("@/app/admin/ecommerce/products/_components/SeoBox"),
  { ssr: false }
);

const EditFields = ({
  eavEditData,
  setIsOpen,
  loading,
  formik,
  parentEntityTypes,
  parentEntityTypesIsLoading,
}) => {
  const [value, setValue] = React.useState("1");
  const [operatorsOpen, setOperatorsOpen] = useState(false);
  const [citiesOpen, setCitiesOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const {
    data: attributeTypes,
    isLoading: attributeTypesIsLoading,
    error: attributeTypesError,
  } = useFetcher(
    `/v1/api/eav/admin/attributeTypes?sortOrder=ASC&orderBy=id&ignorePaging=true`,
    "GET"
  );
  return (
    <Modal
      loading={loading}
      title="افزودن / ویراش دسته بندی"
      handleClose={() => {
        formik.resetForm();
        setIsOpen(false);
      }}
      maxSize="sm"
      isOpen={eavEditData.open}
      handleAccept={formik.handleSubmit}
    >
      <form className="pt-4" onSubmit={formik.handleSubmit}>
        <div className="flex gap-4 mb-4">
          <Input
            onChange={formik.handleChange}
            variant="outlined"
            value={formik.values.name}
            label="نام"
            name="name"
            error={
              formik?.errors?.name && formik?.touched?.name
                ? formik?.errors?.name
                : null
            }
            helperText={formik?.touched?.name && formik?.errors?.name}
          />
          <Select
            fullWidth
            value={formik.values.attributeTypeId}
            name="attributeTypeId"
            onChange={formik.handleChange}
          >
            {attributeTypes?.result.map((attributeType, index) => {
              return (
                <MenuItem key={index} value={attributeType.id}>
                  {attributeType.name}
                </MenuItem>
              );
            })}
          </Select>
        </div>
        <div className="flex gap-4 mb-4">
          <Input
            onChange={(e) =>
              formik.setFieldValue(
                "minLength",
                convertValue(e.target.value, "number")
              )
            }
            variant="outlined"
            value={formik.values.minLength}
            label="حداقل طول کارکتر"
            name="minLength"
            error={
              formik?.errors?.minLength && formik?.touched?.minLength
                ? formik?.errors?.minLength
                : null
            }
            helperText={formik?.touched?.minLength && formik?.errors?.minLength}
          />
          <Input
            onChange={(e) =>
              formik.setFieldValue(
                "maxLength",
                convertValue(e.target.value, "number")
              )
            }
            variant="outlined"
            value={formik.values.maxLength}
            label="حداکثر طول کارکتر"
            name="maxLength"
            error={
              formik?.errors?.maxLength && formik?.touched?.maxLength
                ? formik?.errors?.maxLength
                : null
            }
            helperText={formik?.touched?.maxLength && formik?.errors?.maxLength}
          />
        </div>
        {/* <div className="flex gap-4 mb-4">
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
        </div> */}

        {/* <div>
          <div>
            <label
              htmlFor="first_name"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              نام
            </label>
            <input
              type="text"
              id="first_name"
              className="bg-gray-50 border mb-10 border-gray-300 text-gray-900  mb-10 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              required
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <div className="flex gap-4">
              <div className="w-full">
                <label
                  htmlFor="first_name"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  حداقل طول کارکتر
                </label>
                <input
                  type="text"
                  id="first_name"
                  className="bg-gray-50 border mb-10 border-gray-300 text-gray-900  mb-10 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  // required
                  onChange={(e) => setMin(e.target.value)}
                  value={min}
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="first_name"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  حداکثر طول کارکتر
                </label>
                <input
                  type="text"
                  id="first_name"
                  className="bg-gray-50 border mb-10 border-gray-300 text-gray-900  mb-10 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  // required
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-full">
              <label
                htmlFor="countries_multiple"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                نوع فیلد
              </label>

              <select
                id="countries_multiple"
                value={attributeTypeId}
                className="bg-gray-50 border mb-10 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                onChange={(e) => setAttributeTypeId(e.target.value)}
              >
                {attributeTypes &&
                  attributeTypes.result.map((value, key) => {
                    return (
                      <>
                        <option key={key} value={value.id}>
                          {value.name}
                        </option>
                      </>
                    );
                  })}
              </select>
            </div>
            <div className="w-full flex">
              <label htmlFor="required" className="ml-4">
                اجباری؟
              </label>
              <input
                type="checkbox"
                name=""
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
                id="required"
              />
            </div>
          </div>
        </div> */}
      </form>
    </Modal>
  );
};

export default EditFields;
