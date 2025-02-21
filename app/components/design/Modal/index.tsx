import { Dialog, DialogContent } from "@mui/material";
import React from "react";

interface IModalProps {
  isOpen: boolean;
  children?: React.ReactNode;
  handleClose: () => void;
}
export default function Modal({ isOpen, children, handleClose }: IModalProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
