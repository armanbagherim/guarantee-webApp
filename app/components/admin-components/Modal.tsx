import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { CircularProgress } from "@mui/material";

interface IModal {
  children?: React.ReactNode;
  isOpen: boolean;
  handleClose: any;
  title: string;
  handleAccept: any;
  loading: boolean;
  maxSize?: string;
  isFull?: boolean;
  closeText?: string;
  onClick?: () => void;
  hasAccept?: boolean;
  hasBack?: boolean;
  backText?: string;
  acceptText?: string;
  handleBack?: () => void;
}

const Modal = (props: IModal) => {
  const {
    children,
    isOpen,
    handleClose,
    title,
    handleAccept,
    loading,
    maxSize = "xs",
    isFull = false,
    closeText = "انصراف",
    onClick = null,
    hasAccept = true,
    hasBack = false,
    backText = null,
    handleBack = null,
    acceptText,
  } = props;
  const theme = useTheme();
  const mediaQuery = useMediaQuery(theme.breakpoints.down("md"));
  const fullScreen = isFull || mediaQuery;

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={isOpen}
        fullWidth
        maxWidth={maxSize == "full" ? null : maxSize}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle
          className="bg-blue-700 text-white !font-bold !text-sm !mb-8"
          id="responsive-dialog-title"
        >
          <div className="flex items-center justify-between">
            <span>{title}</span>
            {onClick && (
              <button
                className="bg-white text-blue-800 px-5 py-3 rounded-lg"
                onClick={onClick}
              >
                افزودن
              </button>
            )}
          </div>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <div className="flex justify-center h-[400px] items-center">
              <CircularProgress />
            </div>
          ) : (
            children
          )}
        </DialogContent>
        <DialogActions className="bg-gray-200">
          <div className="flex justify-between w-full">
            <Button color="error" variant="contained" onClick={handleClose}>
              {closeText}
            </Button>
            <div className="flex gap-2">
              {hasBack && (
                <Button
                  color="warning"
                  variant="contained"
                  onClick={handleBack}
                >
                  {backText}
                </Button>
              )}
              {hasAccept && (
                <Button
                  color="success"
                  variant="contained"
                  onClick={handleAccept}
                  autoFocus
                >
                  {acceptText ?? "ثبت"}
                </Button>
              )}
            </div>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Modal;
