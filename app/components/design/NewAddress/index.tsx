"use client";
import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import Map from "./Map";
import { DialogActions } from "@mui/material";
import { useFormik } from "formik";
import { ConvertToNull } from "../../utils/ConvertToNull";
import { fetcher } from "../../admin-components/fetcher";
import { toast } from "react-toastify";
import AdditionalData from "./AdditionalData";
import { formSchema } from "./schema";

export default function NewAddress({
  isOpen,
  handleClose,
  refetch,
  setIsNewAddressOpen,
  edit,
}) {
  const [step, setStep] = useState("location");

  const formik = useFormik({
    initialValues: {
      name: null,
      latitude: null,
      longitude: null,
      provinceId: 0,
      cityId: 0,
      neighborhoodId: 0,
      street: null,
      alley: null,
      plaque: null,
      floorNumber: null,
      postalCode: null,
    },
    // validationSchema: formSchema,
    onSubmit: async (values, { resetForm }) => {
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

        toast.success("موفق");
        refetch();
        setIsNewAddressOpen(false);
        resetForm();
      } catch (error) {
        // setLoading(false);
        toast.error(error.message);
      }
    },
  });

  useEffect(() => {
    if (edit) {
      formik.setValues({
        name: edit.name,
        latitude: edit.latitude,
        longitude: edit.longitude,
        provinceId: edit.provinceId,
        cityId: edit.cityId,
        neighborhoodId: edit.neighborhoodId,
        street: edit.street,
        alley: edit.alley,
        plaque: edit.plaque,
        floorNumber: edit.floorNumber,
        postalCode: edit.postalCode,
      });
    }
  }, [edit]); // Add edit as a dependency

  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      action={() => {
        if (step === "location") {
          setStep("address");
        } else {
          formik.handleSubmit(); // Call Formik's handleSubmit
        }
      }}
    >
      {step == "location" ? (
        <Map data={formik} />
      ) : (
        <AdditionalData data={formik} />
      )}
    </Modal>
  );
}
