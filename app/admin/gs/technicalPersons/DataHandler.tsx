import React, { useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@/app/components/admin-components/Modal";
import Input from "@/app/components/admin-components/Input";
import { Checkbox, FormControlLabel } from "@mui/material";
import Map from "@/app/components/design/NewAddress/Map";
import AdditionalData from "@/app/components/design/NewAddress/AdditionalData";

const DataHandler = ({ editData, loading, formik, setIsEdit }) => {
  const steps = ["Step 1", "Step 2", "Step 3"];

  return (
    <Modal
      loading={loading}
      title="افزودن / ویراش تکنسین"
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
              value={formik.values.firstname || ""}
              label="نام"
              name="firstname"
              error={formik.errors.firstname && formik.touched.firstname}
              helperText={formik.touched.firstname && formik.errors.firstname}
              fullWidth
              margin="normal"
            />
            <Input
              onChange={formik.handleChange}
              variant="outlined"
              value={formik.values.lastname || ""}
              label="نام خانوادگی"
              name="lastname"
              error={formik.errors.lastname && formik.touched.lastname}
              helperText={formik.touched.lastname && formik.errors.lastname}
              fullWidth
              margin="normal"
            />
          </div>
          <Input
            onChange={formik.handleChange}
            variant="outlined"
            value={formik.values.phoneNumber || ""}
            label="شماره موبایل"
            name="phoneNumber"
            error={formik.errors.phoneNumber && formik.touched.phoneNumber}
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
            fullWidth
            margin="normal"
          />
          <Input
            onChange={formik.handleChange}
            variant="outlined"
            value={formik.values.nationalCode || ""}
            label="کد ملی"
            name="nationalCode"
            error={formik.errors.nationalCode && formik.touched.nationalCode}
            helperText={formik.touched.nationalCode && formik.errors.nationalCode}
            fullWidth
            margin="normal"
          />
        </div>
      </form>
    </Modal>
  );
};

export default DataHandler;
