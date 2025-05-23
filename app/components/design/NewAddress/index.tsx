"use client";
import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import Map from "./Map";
import { Button, DialogActions } from "@mui/material";
import { useFormik } from "formik";
import { ConvertToNull } from "../../utils/ConvertToNull";
import { fetcher } from "../../admin-components/fetcher";
import { toast } from "react-hot-toast";
import AdditionalData from "./AdditionalData";
import * as Yup from "yup";

// Define the validation schema
const formSchema = Yup.object({
  name: Yup.string().required("نام آدرس الزامی است"),
  latitude: Yup.number().required("انتخاب مختصات الزامی است"),
  longitude: Yup.number().required("انتخاب مختصات الزامی است"),
  provinceId: Yup.number().min(1, "انتخاب استان الزامی است"),
  street: Yup.string().required("نام خیابان الزامی است"),
  plaque: Yup.string().required("پلاک الزامی است"), // Optional
  floorNumber: Yup.string().required("طبقه الزامی است"), // Optional
  postalCode: Yup.string().required("کد پستی الزامی است"), // Optional
});

export default function NewAddress({
  isOpen,
  handleClose,
  refetch,
  setIsNewAddressOpen,
  edit,
}) {
  const [step, setStep] = useState("location");
  const [tempCity, setTempCity] = useState(null);
  const [proviences, setProvinces] = useState([]);

  const normalizePersianText = (text) => {
    if (!text) return "";
    return text.replace(/ی/g, "ي").trim();
  };

  // Fetch provinces only once on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetcher({
          url: `/v1/api/guarantee/client/provinces`,
          method: "GET",
        });
        setProvinces(res.result || []);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  const fetchAddress = async () => {
    // Check if latitude and longitude are set (restore original behavior)
    if (!formik.values.latitude || !formik.values.longitude) {
      formik.setTouched({ latitude: true, longitude: true });
      toast.error("لطفا یک نقطه روی نقشه انتخاب کنید");
      return;
    }

    try {
      const response = await fetch(
        `https://api.neshan.org/v5/reverse?lat=${formik.values.latitude}&lng=${formik.values.longitude}`,
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
        setTempCity(result.state);

        const normalizedState = normalizePersianText(result.state.replace("استان", ""));
        console.log("Normalized State:", normalizedState);

        const matchedProvince = proviences.find(
          (province) => normalizePersianText(province.name) === normalizedState
        );

        if (matchedProvince) {
          console.log("Matched Province:", matchedProvince);
          formik.setFieldValue("provinceId", matchedProvince.id);
        } else {
          console.warn(`No province found for ${normalizedState}`);
        }

        formik.setFieldValue("street", result.formatted_address);
        setStep("address");
      }
    } catch (error) {
      setStep("location");
      toast.error("خطا در دریافت آدرس");
      console.error("Error fetching address:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: null,
      latitude: null,
      longitude: null,
      provinceId: 0,
      street: null,
      plaque: null,
      floorNumber: null,
      postalCode: null,
    },
    validationSchema: formSchema,
    onSubmit: async (values, { resetForm }) => {
      // Validate form before submission
      const errors = await formik.validateForm(values);
      if (Object.keys(errors).length > 0) {
        formik.setTouched({
          name: true,
          latitude: true,
          longitude: true,
          provinceId: true,
          street: true,
          plaque: true,
          floorNumber: true,
          postalCode: true,
        });
        Object.values(errors).forEach((error) => toast.error(error));
        return;
      }

      const dataBody = ConvertToNull(values);
      console.log(dataBody);
      try {
        let result = await fetcher({
          url: edit
            ? `/v1/api/guarantee/client/addresses/${edit.id}`
            : `/v1/api/guarantee/client/addresses`,
          method: edit ? "PUT" : "POST",
          body: dataBody,
        });

        toast.success("ثبت آدرس با موفقیت انجام شد");
        refetch();
        setStep("location");
        setIsNewAddressOpen(false);
        resetForm();
      } catch (error) {
        toast.error(error.message || "خطا در ثبت آدرس");
      }
    },
  });

  useEffect(() => {
    if (edit) {
      formik.setValues({
        name: edit.name || null,
        latitude: edit.latitude || null,
        longitude: edit.longitude || null,
        provinceId: edit.provinceId || 0,
        street: edit.street || null,
        plaque: edit.plaque || null,
        floorNumber: edit.floorNumber || null,
        postalCode: edit.postalCode || null,
      });
    }
  }, [edit]);

  const handlePreviousStep = () => {
    if (step === "address") {
      setStep("location");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      handleClose={() => {
        formik.resetForm();
        setStep("location");
        handleClose();
      }}
    >
      {step === "location" ? (
        <div className="relative">
          <Map data={formik} />
          {formik.touched.latitude && formik.errors.latitude && (
            <p className="text-red-500 text-sm mt-2">{formik.errors.latitude}</p>
          )}

        </div>
      ) : (
        <AdditionalData proviences={proviences} data={formik} />
      )}
      <DialogActions>
        {(() => {
          const isStepAddress = step === "address";
          const isStepLocation = step === "location";

          const buttonClose = (
            <Button
              key="close"
              variant="contained"
              color="error"
              onClick={() => {
                formik.resetForm();
                setStep("location");
                handleClose();
              }}
              disabled={formik.isSubmitting}
              className="w-full"
            >
              بستن
            </Button>
          );

          const buttonPrevious = isStepAddress ? (
            <Button
              key="prev"
              variant="contained"
              color="primary"
              onClick={handlePreviousStep}
              className="w-full"
            >
              مرحله قبل
            </Button>
          ) : null;

          const buttonSubmit = isStepLocation ? (
            <Button
              key="map"
              variant="contained"
              color="success"
              onClick={fetchAddress}
              className="w-full"
              fullWidth
            >
              ثبت و دریافت اطلاعات از روی نقشه
            </Button>
          ) : (
            <Button
              key="save"
              variant="contained"
              color="success"
              onClick={() => formik.handleSubmit()}
              className="w-full"
              autoFocus
            >
              ذخیره آدرس
            </Button>
          );

          // اگر ۳ دکمه داریم → دوتا بالا، سومی پایین
          if (buttonPrevious) {
            return (
              <div className="grid w-full gap-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {buttonClose}
                  {buttonPrevious}
                </div>
                <div>{buttonSubmit}</div>
              </div>
            );
          }

          // اگر فقط ۲ دکمه داریم → کنار هم باشن
          return (
            <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-2">
              {buttonClose}
              {buttonSubmit}
            </div>
          );
        })()}
      </DialogActions>

    </Modal>
  );
}