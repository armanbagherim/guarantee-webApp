import React, { useState } from "react";

import Modal from "@/app/components/admin-components/Modal";
import LightDataGrid from "@/app/components/admin-components/LightDataGrid/LightDataGrid";
import { columns } from "./columns";
import ContactDataHandler from "./DataHandler";
import { ConvertToNull } from "@/app/components/utils/ConvertToNull";
import { fetcher } from "@/app/components/admin-components/fetcher";
import { useFormik } from "formik";
import { toast } from "react-toastify";

const ContractDataGrid = ({
  contractsModal,
  setContractsModal,
  setFetchContracts,
  fetchContracts,
}) => {
  const [isNewContractIsOpen, setIsNewContractIsOpen] = useState({ isOpen: false, id: null })
  const [loading, setLoading] = useState(false)
  const [triggered, setTriggered] = useState(false);

  const contractData = useFormik({
    enableReinitialize: true,
    validateOnChange: false,
    initialValues: {
      organizationId: isNewContractIsOpen.id,
      representativeShare: null,
      startDate: null,
      endDate: null,
    },
    // validationSchema: formSchema,
    onSubmit: async (values, { resetForm }) => {
      const dataBody = ConvertToNull(values);
      console.log(dataBody);
      try {
        const result = await fetcher({
          url: `/v1/api/guarantee/admin/guaranteeOrganizationContracts`,
          method: "POST",
          body: dataBody,
        });

        toast.success("موفق");
        setLoading(false);
        setTriggered(!triggered);
        setIsNewContractIsOpen({ isOpen: false, id: null });
        resetForm();
      } catch (error) {
        setLoading(false);
        toast.error(error.message);
      }
    },
  });


  return (
    <>
      <ContactDataHandler isOpen={isNewContractIsOpen} setIsOpen={setIsNewContractIsOpen} formik={contractData} loading={loading} />
      <Modal
        onClick={(e) => setIsNewContractIsOpen({ isOpen: true, id: contractsModal.organizationId })}
        title="افزودن / ویراش قرارداد"
        handleClose={() => {
          setContractsModal({ open: false });
        }}
        maxSize="sm"
        isOpen={contractsModal.open}
      >
        <LightDataGrid
          triggered={fetchContracts}
          url={`/v1/api/guarantee/admin/guaranteeOrganizationContracts?organizationId=${contractsModal.organizationId}`}
          columns={columns()}
        />
      </Modal></>
  );
};

export default ContractDataGrid;
