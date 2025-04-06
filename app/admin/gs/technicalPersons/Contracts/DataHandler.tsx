import React, { useState } from "react";

import Modal from "@/app/components/admin-components/Modal";
import Input from "@/app/components/admin-components/Input";
import DatePickerPersian from "@/app/components/utils/DatePicker";

const ContactDataHandler = ({ isOpen, loading, formik, setIsOpen }) => {
  const steps = ["Step 1", "Step 2", "Step 3"];

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  return (
    <Modal
      loading={loading}
      title="افزودن / ویراش دسته بندی"
      handleClose={() => {
        formik.resetForm();
        setIsOpen({ isOpen: false, id: null});
        handleReset();
      }}
      closeText="انصراف"
      maxSize="sm"
      isOpen={isOpen.isOpen}
      handleAccept={formik.handleSubmit}
    >
      <form className="py-12`" onSubmit={formik.handleSubmit}>
        <DatePickerPersian label="تاریخ شروع"  date={formik.values.startDate} onChange={e => formik.setFieldValue("startDate" ,new Date(e).toISOString())} />
        <DatePickerPersian label="تاریخ پایان"  date={formik.values.endDate} onChange={e => formik.setFieldValue("endDate" ,new Date(e).toISOString())} />
        <Input
          onChange={e => formik.setFieldValue("representativeShare", +e.target.value)}
          variant="outlined"
          value={formik.values.representativeShare || ""}
          label="درصد سهم"
          name="representativeShare"
          error={formik.errors.representativeShare && formik.touched.representativeShare}
          helperText={formik.touched.representativeShare && formik.errors.representativeShare}
          fullWidth
          margin="normal"
        />
      </form>
    </Modal>
  );
};

export default ContactDataHandler;
