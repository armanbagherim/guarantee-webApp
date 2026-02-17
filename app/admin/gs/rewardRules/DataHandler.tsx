"use client";

import React from "react";
import Modal from "@/app/components/admin-components/Modal";
import Input from "@/app/components/admin-components/Input";
import PriceInput from "@/app/components/admin-components/PriceInput";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import DatePickerPersian from "@/app/components/utils/DatePicker";
import { FormikProps } from "formik";
import {
  EditModalState,
  RewardRuleFormValues,
  VipBundleTypeOption,
} from "./types";

interface DataHandlerProps {
  editData: EditModalState;
  loading: boolean;
  formik: FormikProps<RewardRuleFormValues>;
  setIsEdit: (value: EditModalState) => void;
  vipBundleTypes: VipBundleTypeOption[];
}

const DataHandler: React.FC<DataHandlerProps> = ({
  editData,
  loading,
  formik,
  setIsEdit,
  vipBundleTypes,
}) => {
  const handleClose = () => {
    formik.resetForm();
    setIsEdit({ open: false, id: null, active: false });
  };

  const handleNumberChange =
    (field: keyof RewardRuleFormValues) =>
      (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value;
        formik.setFieldValue(field, value === "" ? null : Number(value));
      };

  const handleVipBundleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    formik.setFieldValue(
      "vipBundleTypeId",
      value === "" ? null : Number(value)
    );
  };

  return (
    <>
      <Modal
        loading={loading}
        title={editData.active ? "ویرایش قانون پاداش" : "افزودن قانون پاداش"}
        handleClose={handleClose}
        maxSize="md"
        isOpen={editData.open}
        handleAccept={formik.handleSubmit}
      >
        <form className="pt-4" onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              onChange={formik.handleChange}
              variant="outlined"
              value={formik.values.title || ""}
              label="عنوان"
              name="title"
              error={Boolean(formik.touched.title && formik.errors.title)}
              helperText={
                formik.touched.title ? formik.errors.title : undefined
              }
              fullWidth
            />
            <PriceInput
              onChange={(val) => formik.setFieldValue("rewardAmount", val)}
              variant="outlined"
              value={formik.values.rewardAmount ?? ""}
              label="مبلغ پاداش"
              name="rewardAmount"
              fullWidth
            />

            <Input
              onChange={handleNumberChange("monthPeriod")}
              variant="outlined"
              value={formik.values.monthPeriod ?? ""}
              label="بازه ماهانه"
              name="monthPeriod"
              type="number"
              fullWidth
            />
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DatePickerPersian
                label="تاریخ شروع"
                date={
                  formik.values.validFrom
                    ? new Date(formik.values.validFrom)
                    : null
                }
                onChange={(value: string | null) =>
                  formik.setFieldValue("validFrom", value)
                }
              />
              <DatePickerPersian
                label="تاریخ پایان"
                date={
                  formik.values.validUntil
                    ? new Date(formik.values.validUntil)
                    : null
                }
                onChange={(value: string | null) =>
                  formik.setFieldValue("validUntil", value)
                }
              />
            </div>
            <div className="md:col-span-2">
              <textarea
                rows={4}
                name="description"
                value={formik.values.description || ""}
                onChange={formik.handleChange}
                className="w-full border border-gray-200 focus:border-blue-600 outline-none rounded-xl p-4 text-sm"
                placeholder="توضیحات"
              />
            </div>
            <div className="md:col-span-2">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.isActive || false}
                    onChange={(event) =>
                      formik.setFieldValue("isActive", event.target.checked)
                    }
                    name="isActive"
                  />
                }
                label="فعال"
              />
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default DataHandler;
