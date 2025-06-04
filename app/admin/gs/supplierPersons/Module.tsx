"use client";

import React, { useEffect, useState } from "react";
import { pageTitle } from "../../layout";
import { useAtom } from "jotai";
import LightDataGrid from "@/app/components/admin-components/LightDataGrid/LightDataGrid";
import { columns } from "./columns";
import DataHandler from "./DataHandler";
import { fetcher } from "@/app/components/admin-components/fetcher";
import { useFormik } from "formik";
import { ConvertToNull } from "@/app/components/utils/ConvertToNull";
import toast from "@/app/components/toast";
import ContractDataGrid from "./Contracts/ContractDataGrid";

export default function EavTypesModule() {
  const [title, setTitle] = useAtom(pageTitle);
  const [triggered, setTriggered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchContracts, setFetchContracts] = useState(false);

  const [isEditEav, setIsEditEav] = useState({
    open: false,
    id: null,
    active: false,
  });

  const [contractsModal, setContractsModal] = useState({
    open: false,
    organizationId: null,
    isNewOpen: false,
  });

  useEffect(() => {
    setTitle({
      title: "تامین کنندگان ",
      buttonTitle: "افزودن",
      link: null,
      onClick: () =>
        setIsEditEav({
          open: true,
          active: false,
        }),
    });
  }, []);

  const eavData = useFormik({
    enableReinitialize: true,
    validateOnChange: false,
    initialValues: {
      firstname: null,
      lastname: null,
      phoneNumber: null,
      nationalCode: null,
    },
    // validationSchema: formSchema,
    onSubmit: async (values, { resetForm }) => {
      const dataBody = ConvertToNull(values);
      console.log(dataBody);
      try {
        const result = await fetcher({
          url: `/v1/api/guarantee/admin/supplierPersons${isEditEav.active ? `/${isEditEav.id}` : ""
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
        url={"/v1/api/guarantee/admin/supplierPersons"}
        columns={columns(
          isEditEav,
          setIsEditEav,
          triggered,
          setTriggered,
          eavData,
          setContractsModal
        )}
      />
    </div>
  );
}
