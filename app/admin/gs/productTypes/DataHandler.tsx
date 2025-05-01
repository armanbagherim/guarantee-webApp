import React, { useState } from "react";
import ModalSelect from "@/app/components/admin-components/ModalSelect";
import { Autocomplete, Checkbox, Chip, CircularProgress, TextField } from "@mui/material";
import Map from "@/app/components/admin-components/Map";
import Modal from "@/app/components/admin-components/Modal";
import Input from "@/app/components/admin-components/Input";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import dynamic from "next/dynamic";
import { convertValue } from "@/app/components/utils/ConvertType";

const DataHandler = ({ editData, loading, formik, setIsEdit }) => {
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
      title="افزودن / ویراش انواع محصول"
      handleClose={() => {
        formik.resetForm();
        setIsEdit({ active: false, id: null, open: false });
      }}
      maxSize="sm"
      isOpen={editData.open}
      handleAccept={formik.handleSubmit}
    >
      <form className="pt-4" onSubmit={formik.handleSubmit}>
        <div className="flex gap-4 mb-4">
          <Input
            onChange={formik.handleChange}
            variant="outlined"
            value={formik.values.title}
            label="نام"
            name="title"
            error={
              formik?.errors?.title && formik?.touched?.title
                ? formik?.errors?.title
                : null
            }
            helperText={formik?.touched?.title && formik?.errors?.title}
          />
          <Input
            onChange={formik.handleChange}
            variant="outlined"
            value={formik.values.description}
            label="توضیحات"
            name="description"
            error={
              formik?.errors?.description && formik?.touched?.description
                ? formik?.errors?.description
                : null
            }
            helperText={
              formik?.touched?.description && formik?.errors?.description
            }
          />
        </div>
        <label htmlFor="mandatoryAttendance">نیازمند حضور نماینده</label>
        <Checkbox
          checked={formik.values.mandatoryAttendance ?? false}
          onClick={e => formik.setFieldValue("mandatoryAttendance", !formik.values.mandatoryAttendance)}
          color="primary"
          id="mandatoryAttendance"
        />
      </form>
    </Modal>
  );
};

export default DataHandler;
