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
import toast from "react-hot-toast";
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
      title: "نمایندگان",
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
      name: null,
      isNationwide: true,
      isOnlinePayment: true,
      address: {
        name: null,
        latitude: null,
        longitude: null,
        provinceId: null,
        cityId: null,
        neighborhoodId: null,
        street: null,
        alley: null,
        plaque: null,
        floorNumber: null,
        postalCode: null,
      },
      user: {
        firstname: null,
        lastname: null,
        phoneNumber: null,
      },
    },
    // validationSchema: formSchema,
    onSubmit: async (values, { resetForm }) => {
      const dataBody = ConvertToNull(values);
      console.log(dataBody);
      try {
        const result = await fetcher({
          url: `/v1/api/guarantee/admin/guaranteeOrganizations${isEditEav.active ? `/${isEditEav.id}` : ""
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

      <ContractDataGrid
        contractsModal={contractsModal}
        setContractsModal={setContractsModal}
        setFetchContracts={setFetchContracts}
        fetchContracts={fetchContracts}
      />

      <LightDataGrid
        triggered={triggered}
        url={"/v1/api/guarantee/admin/guaranteeOrganizations"}
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
