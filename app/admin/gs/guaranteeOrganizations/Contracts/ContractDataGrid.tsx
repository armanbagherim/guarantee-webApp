import React from "react";

import Modal from "@/app/components/admin-components/Modal";
import LightDataGrid from "@/app/components/admin-components/LightDataGrid/LightDataGrid";
import { columns } from "./columns";

const ContractDataGrid = ({
  contractsModal,
  setContractsModal,
  setFetchContracts,
  fetchContracts,
}) => {
  return (
    <Modal
      onClick={(e) => console.log("object")}
      title="افزودن / ویراش دسته بندی"
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
    </Modal>
  );
};

export default ContractDataGrid;
