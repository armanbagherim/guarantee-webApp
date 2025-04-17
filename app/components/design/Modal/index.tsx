import { Button, Dialog, DialogActions, DialogContent, useMediaQuery, useTheme } from "@mui/material";
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
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={fullScreen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>لغو</Button>

        {action && (
          <Button onClick={action} autoFocus>
            تایید
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
