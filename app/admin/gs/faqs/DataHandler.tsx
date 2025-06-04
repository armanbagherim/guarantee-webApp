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
          <div className="flex gap-4 mb-4">
            <Input
              onChange={formik.handleChange}
              variant="outlined"
              value={formik.values.question || ""}
              label="سوال"
              name="question"
              error={
                formik.errors.question &&
                formik.touched.question
              }
              helperText={
                formik.touched.question &&
                formik.errors.question
              }
              fullWidth
              margin="normal"
            />

          </div>
          <div className="flex gap-4 mb-4">
            <Input
              onChange={formik.handleChange}
              variant="outlined"
              value={formik.values.answer || ""}
              label="پاسخ"
              name="answer"
              error={
                formik.errors.answer &&
                formik.touched.answer
              }
              helperText={
                formik.touched.answer &&
                formik.errors.answer
              }
              fullWidth
              margin="normal"
            />

          </div>
          <div className="flex gap-4 mb-4">
            <Input
              onChange={e => formik.setFieldValue("priority", +e.target.value)}
              variant="outlined"
              value={formik.values.priority || ""}
              label="اولویت از ۰ به بالا"
              name="priority"
              error={
                formik.errors.priority &&
                formik.touched.priority
              }
              helperText={
                formik.touched.priority &&
                formik.errors.priority
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
