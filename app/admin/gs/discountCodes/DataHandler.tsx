"use client";

import React from "react";
import Modal from "@/app/components/admin-components/Modal";
import Input from "@/app/components/admin-components/Input";
import {
  Checkbox,
  Dialog,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import DatePickerPersian from "@/app/components/utils/DatePicker";
import PickOrganizationModal from "@/app/admin/gs/cartables/FormsGen/Forms/PickModals/Organization";
import { FormikProps } from "formik";
import {
  DiscountCodeFormValues,
  DiscountType,
  EditModalState,
  OrganizationPickerState,
} from "./types";

interface DataHandlerProps {
  editData: EditModalState;
  loading: boolean;
  formik: FormikProps<DiscountCodeFormValues>;
  setIsEdit: (value: EditModalState) => void;
  discountTypes: DiscountType[];
  organizationPicker: OrganizationPickerState;
  setOrganizationPicker: React.Dispatch<React.SetStateAction<OrganizationPickerState>>;
}

const DataHandler: React.FC<DataHandlerProps> = ({
  editData,
  loading,
  formik,
  setIsEdit,
  discountTypes,
  organizationPicker,
  setOrganizationPicker,
}) => {
  const handleClose = () => {
    formik.resetForm();
    setOrganizationPicker({ isOpen: false, value: null });
    setIsEdit({ open: false, id: null, active: false });
  };

  const handleNumberChange =
    (field: string) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      formik.setFieldValue(field, value === "" ? null : Number(value));
    };

  const openOrganizationPicker = () => {
    setOrganizationPicker((prev) => ({
      ...prev,
      isOpen: true,
    }));
  };

  const handleOrganizationSelect = (organizationId: string | number | null) => {
    if (organizationId === null || organizationId === undefined) {
      formik.setFieldValue("organizationId", null);
      return;
    }
    formik.setFieldValue("organizationId", String(organizationId));
  };

  const handleDiscountTypeChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    formik.setFieldValue("discountTypeId", value === "" ? null : Number(value));
  };

  return (
    <>
      <Modal
        loading={loading}
        title={editData.active ? "ویرایش کد تخفیف" : "افزودن کد تخفیف"}
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
              value={formik.values.code || ""}
              label="کد"
              name="code"
              error={formik.errors.code && formik.touched.code}
              helperText={formik.touched.code && formik.errors.code}
              fullWidth
            />
            <Input
              onChange={formik.handleChange}
              variant="outlined"
              value={formik.values.title || ""}
              label="عنوان"
              name="title"
              error={formik.errors.title && formik.touched.title}
              helperText={formik.touched.title && formik.errors.title}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="discount-type-label">نوع تخفیف</InputLabel>
              <Select
                labelId="discount-type-label"
                value={
                  typeof formik.values.discountTypeId === "number"
                    ? String(formik.values.discountTypeId)
                    : ""
                }
                label="نوع تخفیف"
                onChange={handleDiscountTypeChange}
              >
                {discountTypes.map((type) => (
                  <MenuItem key={type.id} value={String(type.id)}>
                    {type.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Input
              onChange={handleNumberChange("discountValue")}
              variant="outlined"
              value={formik.values.discountValue ?? ""}
              label="مقدار تخفیف"
              name="discountValue"
              type="number"
              fullWidth
            />
            <Input
              onChange={handleNumberChange("totalUsageLimit")}
              variant="outlined"
              value={formik.values.totalUsageLimit ?? ""}
              label="حداکثر استفاده کلی"
              name="totalUsageLimit"
              type="number"
              fullWidth
            />
            <Input
              onChange={handleNumberChange("perUserUsageLimit")}
              variant="outlined"
              value={formik.values.perUserUsageLimit ?? ""}
              label="حداکثر استفاده هر کاربر"
              name="perUserUsageLimit"
              type="number"
              fullWidth
            />
            <Input
              onChange={handleNumberChange("maxDiscountAmount")}
              variant="outlined"
              value={formik.values.maxDiscountAmount ?? ""}
              label="سقف مبلغ تخفیف"
              name="maxDiscountAmount"
              type="number"
              fullWidth
            />
            <div>
              <DatePickerPersian
                label="تاریخ شروع"
                date={formik.values.validFrom}
                onChange={(value) => formik.setFieldValue("validFrom", value)}
              />
            </div>
            <div>
              <DatePickerPersian
                label="تاریخ پایان"
                date={formik.values.validUntil}
                onChange={(value) => formik.setFieldValue("validUntil", value)}
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="button"
                className="w-full bg-gray-100 hover:bg-gray-200 transition-all rounded-xl px-4 py-3 text-right font-semibold text-gray-700"
                onClick={openOrganizationPicker}
              >
                {organizationPicker.value || "انتخاب نماینده"}
              </button>
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

      <Dialog
        open={organizationPicker.isOpen}
        onClose={() =>
          setOrganizationPicker((prev) => ({
            ...prev,
            isOpen: false,
          }))
        }
        fullWidth
        maxWidth="sm"
      >
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">انتخاب نماینده</h2>
          <PickOrganizationModal
            setOrganId={handleOrganizationSelect}
            url={`/v1/api/guarantee/admin/guaranteeOrganizations`}
            setOrganOpen={setOrganizationPicker}
          />
        </div>
      </Dialog>
    </>
  );
};

export default DataHandler;
