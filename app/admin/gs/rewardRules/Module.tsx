"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { pageTitle } from "../../layout";
import LightDataGrid from "@/app/components/admin-components/LightDataGrid/LightDataGrid";
import DataHandler from "./DataHandler";
import { columns } from "./columns";
import { useFormik } from "formik";
import { ConvertToNull } from "@/app/components/utils/ConvertToNull";
import { fetcher } from "@/app/components/admin-components/fetcher";
import toast from "@/app/components/toast";
import {
  EditModalState,
  RewardRuleFormValues,
  VipBundleTypeOption,
} from "./types";

export default function RewardRulesModule() {
  const [, setTitle] = useAtom(pageTitle);
  const [triggered, setTriggered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vipBundleTypes, setVipBundleTypes] = useState<VipBundleTypeOption[]>(
    []
  );
  const [isEditModal, setIsEditModal] = useState<EditModalState>({
    open: false,
    id: null,
    active: false,
  });

  const fetchVipBundleTypes = useCallback(async () => {
    try {
      const response: any = await fetcher({
        url: `/v1/api/guarantee/admin/vipBundleTypes`,
        method: "GET",
      });
      setVipBundleTypes(response?.result || []);
    } catch (error: any) {
      toast.error(error?.message || "خطا در دریافت نوع کارت VIP");
    }
  }, []);

  useEffect(() => {
    fetchVipBundleTypes();
  }, [fetchVipBundleTypes]);

  const rewardRuleFormik = useFormik<RewardRuleFormValues>({
    enableReinitialize: true,
    validateOnChange: false,
    initialValues: {
      title: "",
      rewardAmount: null,
      vipBundleTypeId: null,
      monthPeriod: null,
      validFrom: null,
      validUntil: null,
      isActive: true,
      description: "",
    },
    onSubmit: async (values, { resetForm }) => {
      const payload = ConvertToNull({
        ...values,
      });

      try {
        setLoading(true);
        await fetcher({
          url: `/v1/api/guarantee/admin/rewardRules${isEditModal.active ? `/${isEditModal.id}` : ""
            }`,
          method: isEditModal.active ? "PUT" : "POST",
          body: payload,
        });
        toast.success("عملیات با موفقیت انجام شد");
        setIsEditModal({ open: false, id: null, active: false });
        setTriggered((prev) => !prev);
        resetForm();
      } catch (error: any) {
        toast.error(error?.message || "خطا در ثبت اطلاعات");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleOpenCreate = useCallback(() => {
    rewardRuleFormik.resetForm();
    setIsEditModal({
      open: true,
      id: null,
      active: false,
    });
  }, [rewardRuleFormik]);

  useEffect(() => {
    setTitle({
      title: "قوانین پاداش",
      buttonTitle: "افزودن",
      link: null,
      onClick: handleOpenCreate,
    });
  }, [handleOpenCreate, setTitle]);

  return (
    <div>
      <DataHandler
        editData={isEditModal}
        loading={loading}
        formik={rewardRuleFormik}
        setIsEdit={setIsEditModal}
        vipBundleTypes={vipBundleTypes}
      />

      <LightDataGrid
        triggered={triggered}
        url={`/v1/api/guarantee/admin/rewardRules`}
        columns={columns(
          isEditModal,
          setIsEditModal,
          triggered,
          setTriggered,
          rewardRuleFormik
        )}
        detailPanel={undefined}
      />
    </div>
  );
}
