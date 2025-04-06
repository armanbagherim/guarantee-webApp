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

  return (
    <Modal
      loading={loading}
      title="افزودن / ویراش انواع کارت گارانتی"
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
              onChange={e => formik.setFieldValue('price', +e.target.value)}
              variant="outlined"
              value={formik.values.price || ""}
              label="قیمت"
              name="price"
              error={formik.errors.price && formik.touched.price}
              helperText={formik.touched.price && formik.errors.price}
              fullWidth
              margin="normal"
            />
          </div>
          <div className="flex gap-4 mb-4">
            <Input
              variant="outlined"
              value={formik.values.fee || ""}
              onChange={e => formik.setFieldValue('fee', +e.target.value)}
              label="مقدار اعتبار"
              name="fee"
              error={formik.errors.fee && formik.touched.fee}
              helperText={formik.touched.fee && formik.errors.fee}
              fullWidth
              margin="normal"
            />
            <Input
              onChange={formik.handleChange}
              variant="outlined"
              value={formik.values.cardColor || ""}
              label="رنگ"
              name="cardColor"
              error={formik.errors.cardColor && formik.touched.cardColor}
              helperText={formik.touched.cardColor && formik.errors.cardColor}
              fullWidth
              margin="normal"
            />
          </div>
          <Input
            onChange={e => formik.setFieldValue('monthPeriod', +e.target.value)}
            variant="outlined"
            value={formik.values.monthPeriod || ""}
            label="بازه به ماه"
            name="monthPeriod"
            error={formik.errors.monthPeriod && formik.touched.monthPeriod}
            helperText={formik.touched.monthPeriod && formik.errors.monthPeriod}
            fullWidth
            margin="normal"
          />
        </div>
      </form>
    </Modal>
  );
};

export default DataHandler;
