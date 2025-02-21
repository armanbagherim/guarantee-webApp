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

const EditFieldValues = ({ eavEditData, setIsOpen, loading, formik }) => {
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
            value={formik.values.value}
            label="نام"
            name="value"
            error={
              formik?.errors?.value && formik?.touched?.value
                ? formik?.errors?.value
                : null
            }
            helperText={formik?.touched?.name && formik?.errors?.name}
          />
        </div>
      </form>
    </Modal>
  );
};

export default EditFieldValues;
