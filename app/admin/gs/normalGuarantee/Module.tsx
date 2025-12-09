"use client";

import React, { useEffect, useState } from "react";
import { pageTitle } from "../../layout";
import { useAtom } from "jotai";
import LightDataGrid from "@/app/components/admin-components/LightDataGrid/LightDataGrid";
import { columns } from "./columns"; // ← این همون فایل بالا
import DataHandler from "./DataHandler";
import { fetcher } from "@/app/components/admin-components/fetcher";
import { useFormik } from "formik";
import { ConvertToNull } from "@/app/components/utils/ConvertToNull";
import toast from "@/app/components/toast";

// MUI Dialog
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Typography,
  Box,
} from "@mui/material";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PersonOffIcon from "@mui/icons-material/PersonOff";

export default function EavTypesModule() {
  const [title, setTitle] = useAtom(pageTitle);
  const [triggered, setTriggered] = useState(false);

  // حالت‌های Dialog مالک گارانتی
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedAssign, setSelectedAssign] = useState<any>(null);

  const openAssignDialog = (assignData: any) => {
    setSelectedAssign(assignData);
    setAssignDialogOpen(true);
  };

  const closeAssignDialog = () => {
    setAssignDialogOpen(false);
    setSelectedAssign(null);
  };

  useEffect(() => {
    setTitle({
      title: "کارت های گارانتی عادی",
      buttonTitle: null,
      link: null,
      onClick: null,
    });
  }, []);

  const eavData = useFormik({
    initialValues: { title: "", providerId: null, description: "" },
    onSubmit: async (values, { resetForm }) => {
      // ... همون کد قبلیت
    },
  });

  return (
    <div className="space-y-6">
   
      <LightDataGrid
        triggered={triggered}
        url="/v1/api/guarantee/admin/normalGuarantees"
        columns={columns(openAssignDialog)} // ← فقط یه فانکشن می‌گیره
      />

      {/* Dialog نمایش مالک گارانتی */}
      <Dialog
        open={assignDialogOpen}
        onClose={closeAssignDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <AssignmentIndIcon color="primary" />
            اطلاعات مالک گارانتی
          </Box>
        </DialogTitle>

        <DialogContent dividers dir="">
          {selectedAssign ? (
            <Box sx={{ textAlign: "left", direction: "" }}>
              <Typography variant="body1" gutterBottom>
                <strong>نام:</strong> {selectedAssign.user.firstname} {selectedAssign.user.lastname}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>موبایل:</strong> {selectedAssign.user.phoneNumber}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>نام کاربری:</strong> {selectedAssign.user.username}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                <strong>تاریخ تخصیص:</strong>{" "}
                {new Date(selectedAssign.createdAt).toLocaleDateString("fa-IR")} ساعت{" "}
                {new Date(selectedAssign.createdAt).toLocaleTimeString("fa-IR")}
              </Typography>
            </Box>
          ) : (
            <Box textAlign="center" py={4}>
              <PersonOffIcon sx={{ fontSize: 64, color: "gray", mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                این گارانتی هنوز به هیچ کاربری تخصیص داده نشده است.
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={closeAssignDialog} variant="contained" fullWidth>
            بستن
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}