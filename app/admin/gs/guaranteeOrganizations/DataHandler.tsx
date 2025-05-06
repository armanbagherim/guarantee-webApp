import React, { useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@/app/components/admin-components/Modal";
import Input from "@/app/components/admin-components/Input";
import { Checkbox, FormControlLabel, Box } from "@mui/material";
import Map from "@/app/components/design/NewAddress/Map";
import AdditionalData from "@/app/components/design/NewAddress/AdditionalData";
import DatePickerPersian from "@/app/components/utils/DatePicker";

const DataHandler = ({ editData, loading, formik, setIsEdit }) => {
  const steps = ["اطلاعات اصلی", "مشخصات مکانی", "اطلاعات کاربر", "نقشه"];

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
      title="افزودن / ویراش نماینده"
      handleClose={() => {
        formik.resetForm();
        setIsEdit({ active: false, id: null, open: false });
        handleReset();
      }}
      hasBack={activeStep > 0}
      handleBack={handleBack}
      backText="قبلی"
      closeText="انصراف"
      maxSize="sm"
      isOpen={editData.open}
      acceptText={activeStep === steps.length - 1 ? "ثبت نهایی" : "مرحله بعد"}
      handleAccept={activeStep === steps.length - 1 ? formik.handleSubmit : handleNext}
    >
      <form className="pt-4" onSubmit={formik.handleSubmit}>
        <div style={{ width: "100%" }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <div>
            {activeStep === steps.length ? (
              <div>
                <Typography>همه مراحل تکمیل شدند!</Typography>
                <Button onClick={() => formik.handleSubmit()}>ارسال</Button>
              </div>
            ) : (
              <div>
                {/* Step 1: اطلاعات اصلی */}
                {activeStep === 0 && (
                  <div className="py-8">
                    <Input
                      onChange={formik.handleChange}
                      variant="outlined"
                      value={formik.values.name || ""}
                      label="نام"
                      name="name"
                      error={formik.errors.name && formik.touched.name}
                      helperText={formik.touched.name && formik.errors.name}
                      fullWidth
                      margin="normal"
                    />
                    <DatePickerPersian label="تاریخ مجوز" date={formik.values.licenseDate} onChange={e => formik.setFieldValue("licenseDate", new Date(e).toISOString())} />
                    <Input
                      onChange={formik.handleChange}
                      variant="outlined"
                      value={formik.values.code || ""}
                      label="کد"
                      name="code"
                      error={formik.errors.code && formik.touched.code}
                      helperText={formik.touched.code && formik.errors.code}
                      fullWidth
                      margin="normal"
                    />
                    <Box mt={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formik.values.isNationwide}
                            onChange={(e) =>
                              formik.setFieldValue(
                                "isNationwide",
                                e.target.checked
                              )
                            }
                            name="isNationwide"
                            color="primary"
                          />
                        }
                        label="مرکزی"
                      />
                    </Box>
                    <Box mt={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formik.values.isOnlinePayment}
                            onChange={formik.handleChange}
                            name="isOnlinePayment"
                            color="primary"
                          />
                        }
                        label="پرداخت آنلاین"
                      />
                    </Box>
                  </div>
                )}

                {/* Step 2: مشخصات مکانی */}
                {activeStep === 1 && (
                  <div className="py-8">
                    <AdditionalData isAdmin={true} data={formik} />
                  </div>
                )}

                {/* Step 3: اطلاعات کاربر */}
                {activeStep === 2 && (
                  <div className="py-8">
                    <Box mb={3}>
                      <Input
                        onChange={formik.handleChange}
                        variant="outlined"
                        value={formik.values.user.firstname || ""}
                        label="نام"
                        name="user.firstname"
                        error={
                          formik.errors.user?.firstname &&
                          formik.touched.user?.firstname
                        }
                        helperText={
                          formik.touched.user?.firstname &&
                          formik.errors.user?.firstname
                        }
                        fullWidth
                      />
                    </Box>
                    <Box mb={3}>
                      <Input
                        onChange={formik.handleChange}
                        variant="outlined"
                        value={formik.values.user.lastname || ""}
                        label="نام خانوادگی"
                        name="user.lastname"
                        error={
                          formik.errors.user?.lastname &&
                          formik.touched.user?.lastname
                        }
                        helperText={
                          formik.touched.user?.lastname &&
                          formik.errors.user?.lastname
                        }
                        fullWidth
                      />
                    </Box>
                    <Box mb={3}>
                      <Input
                        onChange={formik.handleChange}
                        variant="outlined"
                        value={formik.values.user.phoneNumber || ""}
                        label="شماره تلفن"
                        name="user.phoneNumber"
                        error={
                          formik.errors.user?.phoneNumber &&
                          formik.touched.user?.phoneNumber
                        }
                        helperText={
                          formik.touched.user?.phoneNumber &&
                          formik.errors.user?.phoneNumber
                        }
                        fullWidth
                      />
                    </Box>
                  </div>
                )}

                {/* Step 4: نقشه */}
                {activeStep === 3 && (
                  <div className="py-8" style={{ height: "400px" }}>
                    <Map isAdmin={true} data={formik} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default DataHandler;