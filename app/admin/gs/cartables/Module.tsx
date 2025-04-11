"use client";

import React, { useEffect, useState } from "react";
import { pageTitle } from "../../layout";
import { useAtom } from "jotai";
import LightDataGrid from "@/app/components/admin-components/LightDataGrid/LightDataGrid";
import { columns } from "./columns";
import FormGen from "./FormsGen";
import HistoryData from "./historyData";
import DetailPanel from "./DetailPanel";

export default function EavTypesModule({ session }) {
  const [title, setTitle] = useAtom(pageTitle);
  const [triggered, setTriggered] = useState(false);
  const [activeRequestActionModal, setActiveRequestActionModal] = useState({
    currentOperation: null,
    isOpen: false,
  })

  const [historyOpen, setHistoryOpen] = useState({
    requestId: null,
    isOpen: false,
  })

  useEffect(() => {
    setTitle({
      title: "کارتابل",
      buttonTitle: null,
      link: null,
    });
  }, []);


  return (
    <div>

      <FormGen triggered={triggered} setTriggered={setTriggered} session={session} action={activeRequestActionModal} setAction={setActiveRequestActionModal} />

      <HistoryData historyOpen={historyOpen} setHistoryOpen={setHistoryOpen} />

      <LightDataGrid
        triggered={triggered}
        url={"/v1/api/guarantee/admin/cartables"}
        columns={columns(
          triggered,
          setTriggered,
          setActiveRequestActionModal,
          historyOpen,
          setHistoryOpen
        )}
        detailPanel={DetailPanel}
      />
    </div>
  );
}
