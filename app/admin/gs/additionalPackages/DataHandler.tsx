import React, { useState } from "react";
import Modal from "@/app/components/admin-components/Modal";
import Input from "@/app/components/admin-components/Input";

const DataHandler = ({ editData, loading, formik, setIsEdit }) => {

  return (
    <Modal
      loading={loading}
      title="افزودن / ویراش شرایط مازاد گارانتی"
      handleClose={() => {
        formik.resetForm();
        setIsEdit({ active: false, id: null, open: false });
      }}
      closeText="انصراف"
      maxSize="sm"
      isOpen={editData.open}
      handleAccept={formik.handleSubmit}
    >
      <form className="pt-4" onSubmit={formik.handleSubmit}>
        <div style={{ width: "100%" }}>
          <div className="flex gap-4">
            <Input
              onChange={formik.handleChange}
              variant="outlined"
              value={formik.values.title || ""}
              label="نام"
              name="title"
              error={
                formik.errors.title &&
                formik.touched.title
              }
              helperText={
                formik.touched.title &&
                formik.errors.title
              }
              fullWidth
              margin="normal"
            />
            <Input
              onChange={e => formik.setFieldValue('price', +e.target.value)}
              variant="outlined"
              value={formik.values.price || ""}
              label="قیمت"
              name="price"
              error={
                formik.errors.price &&
                formik.touched.price
              }
              helperText={
                formik.touched.price &&
                formik.errors.price
              }
              fullWidth
              margin="normal"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default DataHandler;
