import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import React from "react";

interface IModalProps {
  isOpen: boolean;
  children?: React.ReactNode;
  handleClose: () => void;
  action?: () => void;
}
export default function Modal({
  isOpen,
  children,
  handleClose,
  action,
}: IModalProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Disagree</Button>

        {action && (
          <Button onClick={action} autoFocus>
            تایید
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
