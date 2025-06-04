import React, { useEffect, useState } from "react";
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
import toast from "@/app/components/toast";

const DataHandler = ({
  editData,
  loading,
  formik,
  setIsEdit,
  provinces,
  setLoading,
}) => {
  const steps = ["اطلاعات اصلی", "نقشه", "مشخصات مکانی", "اطلاعات کاربر"];
  const [tempCity, setTempCity] = useState(null);
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

  const normalizePersianText = (text) => {
    if (!text) return "";
    return text.replace(/ی/g, "ي").trim();
  };

  // Fetch provinces only once on mount

  const fetchAddress = async () => {
    setLoading(true);
    if (!formik.values.address.latitude || !formik.values.address.longitude) {
      formik.setTouched({ latitude: true, longitude: true });
      toast.error("لطفا یک نقطه روی نقشه انتخاب کنید");
      return;
    }

    try {
      const response = await fetch(
        `https://api.neshan.org/v5/reverse?lat=${formik.values.address.latitude}&lng=${formik.values.address.longitude}`,
        {
          method: "GET",
          headers: {
            "Api-Key": "service.67711799b0114ce5aa1380ba7b2a2f4b",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch address");
      }

      const result = await response.json();
      if (result.status === "OK") {
        const normalizedState = normalizePersianText(
          result.state.replace("استان", "")
        );
        console.log(normalizedState);
        console.log(provinces);
        const matchedProvince = provinces.find(
          (province) => normalizePersianText(province.name) === normalizedState
        );
        console.log(matchedProvince);
        if (matchedProvince) {
          formik.setFieldValue("address.provinceId", matchedProvince.id);
          console.log(matchedProvince);
        } else {
          console.warn(`No province found for ${normalizedState}`);
        }
        setLoading(false);
        formik.setFieldValue("address.street", result.formatted_address);
        handleNext(); // برو به مرحله مشخصات مکانی
      }
    } catch (error) {
      setLoading(false);
      toast.error("خطا در دریافت آدرس");
      console.error("Error fetching address:", error);
    }
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
      handleAccept={
        activeStep === steps.length - 1
          ? formik.handleSubmit
          : activeStep === 1
            ? fetchAddress
            : handleNext
      }
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
                    <DatePickerPersian
                      label="تاریخ مجوز"
                      date={formik.values.licenseDate}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "licenseDate",
                          new Date(e).toISOString()
                        )
                      }
                    />
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
                {activeStep === 2 && (
                  <div className="py-8">
                    <AdditionalData
                      isAdmin={true}
                      proviences={provinces}
                      data={formik}
                    />
                  </div>
                )}

                {/* Step 3: اطلاعات کاربر */}
                {activeStep === 3 && (
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
                {activeStep === 1 && (
                  <div className="py-8" style={{ height: "400px" }}>
                    <Map isAdmin={true} data={formik} />
                    {/* <Button
                      key="map"
                      variant="contained"
                      color="success"
                      onClick={fetchAddress}
                      className="w-full"
                      fullWidth
                    >
                      ثبت و دریافت اطلاعات از روی نقشه
                    </Button> */}
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
