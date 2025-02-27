"use client";
import React, { useState } from "react";
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
}) {
  const [step, setStep] = useState("location");

  const data = useFormik({
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
          url: `/v1/api/guarantee/client/addresses`,
          method: "POST",
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

  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      action={() => {
        if (step === "location") {
          setStep("address");
        } else {
          data.handleSubmit(); // Call Formik's handleSubmit
        }
      }}
    >
      {step == "location" ? (
        <Map data={data} />
      ) : (
        <AdditionalData data={data} />
      )}
    </Modal>
  );
}
