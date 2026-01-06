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
  DiscountCodeFormValues,
  DiscountType,
  EditModalState,
} from "./types";

export default function DiscountCodesModule() {
  const [, setTitle] = useAtom(pageTitle);
  const [triggered, setTriggered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [discountTypes, setDiscountTypes] = useState<DiscountType[]>([]);
  const [isEditModal, setIsEditModal] = useState<EditModalState>({
    open: false,
    id: null,
    active: false,
  });

  const fetchDiscountTypes = useCallback(async () => {
    try {
      const response: any = await fetcher({
        url: `/v1/api/guarantee/admin/discountTypes`,
        method: "GET",
      });
      setDiscountTypes(response?.result || []);
    } catch (error: any) {
      toast.error(error?.message || "خطا در دریافت نوع تخفیف‌ها");
    }
  }, []);

  useEffect(() => {
    fetchDiscountTypes();
  }, [fetchDiscountTypes]);

  const discountFormik = useFormik<DiscountCodeFormValues>({
    enableReinitialize: true,
    validateOnChange: false,
    initialValues: {
      code: "",
      title: "",
      discountTypeId: null as number | null,
      discountValue: null,
      totalUsageLimit: null,
      perUserUsageLimit: null,
      maxDiscountAmount: null,
      validFrom: null as string | null,
      validUntil: null as string | null,
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
          url: `/v1/api/guarantee/admin/discountCodes${
            isEditModal.active ? `/${isEditModal.id}` : ""
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
    discountFormik.resetForm();
    setIsEditModal({
      open: true,
      id: null,
      active: false,
    });
  }, [discountFormik]);

  useEffect(() => {
    setTitle({
      title: "مدیریت کدهای تخفیف",
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
        formik={discountFormik}
        setIsEdit={setIsEditModal}
        discountTypes={discountTypes}
      />

      <LightDataGrid
        triggered={triggered}
        url={`/v1/api/guarantee/admin/discountCodes`}
        columns={columns(
          isEditModal,
          setIsEditModal,
          triggered,
          setTriggered,
          discountFormik
        )}
        detailPanel={undefined}
      />
    </div>
  );
}
