import React, { useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@/app/components/admin-components/Modal";
import Input from "@/app/components/admin-components/Input";
import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select } from "@mui/material";
import Map from "@/app/components/design/NewAddress/Map";
import AdditionalData from "@/app/components/design/NewAddress/AdditionalData";

const DataHandler = ({ editData, loading, formik, setIsEdit, bundleType }) => {
  const steps = ["Step 1", "Step 2", "Step 3"];

  return (
    <Modal
      loading={loading}
      title="صدور کارت VIP"
      handleClose={() => {
        formik.resetForm();
        setIsEdit({ active: false, id: null, open: false });
      }}
      maxSize="sm"
      isOpen={editData.open}
      handleAccept={formik.handleSubmit}
    >
      <form className="pt-4" onSubmit={formik.handleSubmit}>
        <div style={{ width: "100%" }}>
          <div className="flex gap-4 mb-4">
            <Input
              onChange={formik.handleChange}
              variant="outlined"
              value={formik.values.title || ""}
              label="عنوان"
              name="title"
              error={formik.errors.title && formik.touched.title}
              helperText={formik.touched.title && formik.errors.title}
              fullWidth
              margin="normal"
            />
            <Input
              onChange={e => formik.setFieldValue('qty', +e.target.value)}
              variant="outlined"
              value={formik.values.qty || ""}
              label="تعداد"
              name="qty"
              error={formik.errors.qty && formik.touched.qty}
              helperText={formik.touched.qty && formik.errors.qty}
              fullWidth
              margin="normal"
            />
          </div>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">نوع کارت وی آی پی</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={formik.values.vipBundleTypeId}
              label="Age"
              onChange={e => formik.setFieldValue("vipBundleTypeId", e.target.value)}
            >
              {bundleType.map((value, key) => {
                return <MenuItem key={key} value={value.id}>{value.title}</MenuItem>
              })}


            </Select>
          </FormControl>
        </div>
      </form>
    </Modal>
  );
};

export default DataHandler;
