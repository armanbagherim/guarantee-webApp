"use client";

import React, { useEffect, useState } from "react";
import { pageTitle } from "../../layout";
import { useAtom } from "jotai";
import LightDataGrid from "@/app/components/admin-components/LightDataGrid/LightDataGrid";
import { columns } from "./columns";
import DataHandler from "./DataHandler";
import { fetcher, useFetcher } from "@/app/components/admin-components/fetcher";
import { useFormik } from "formik";
import { ConvertToNull } from "@/app/components/utils/ConvertToNull";
import { toast } from "react-toastify";

export default function EavTypesModule() {
  const [title, setTitle] = useAtom(pageTitle);
  const [triggered, setTriggered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isEditEav, setIsEditEav] = useState({
    open: false,
    id: null,
    active: false,
  });

  useEffect(() => {
    setTitle({
      title: "کارت های گارانتی عادی",
      buttonTitle: null,
      link: null,
      onClick: null,
    });
  }, []);

  const eavData = useFormik({
    initialValues: {
      title: "",
      providerId: null,
      description: "",
    },
    // validationSchema: formSchema,
    onSubmit: async (values, { resetForm }) => {
      const dataBody = ConvertToNull(values);

      try {
        let result = await fetcher({
          url: `/v1/api/guarantee/admin/variants${isEditEav.active ? `/${isEditEav.id}` : ""
            }`,
          method: isEditEav.active ? "PUT" : "POST",
          body: dataBody,
        });

        toast.success("موفق");
        setLoading(false);
        setIsOpen(false);
        setTriggered(!triggered);
        setIsEditEav({ active: false, id: null, open: false });
        resetForm();
      } catch (error) {
        setLoading(false);
        toast.error(error.message);
      }
    },
  });

  return (
    <div>
      <DataHandler
        editData={isEditEav}
        loading={loading}
        formik={eavData}
        setIsEdit={setIsEditEav}
      />

      <LightDataGrid
        triggered={triggered}
        url={"/v1/api/guarantee/admin/normalGuarantees"}
        columns={columns(
          isEditEav,
          setIsEditEav,
          triggered,
          setTriggered,
          eavData
        )}
      />
    </div>
  );
}
