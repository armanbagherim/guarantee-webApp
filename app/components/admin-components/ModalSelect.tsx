import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import { FormHelperText, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

export interface ConfirmationDialogRawProps {
  id: string;
  keepMounted: boolean;
  value: string;
  open: boolean;
  onClose: (value?: string) => void;
  children: any;
}

function ConfirmationDialogRaw(props: ConfirmationDialogRawProps) {
  const { onClose, value: valueProp, open, children, ...other } = props;

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 850 } }}
      maxWidth="xl"
      open={open}
      {...other}
    >
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        <div className="flex justify-start w-full">
          <Button
            autoFocus
            variant="contained"
            color="error"
            onClick={handleCancel}
          >
            انصراف
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}

export default function ModalSelect({
  children,
  value,
  label,
  setValue,
  open,
  setOpen,
  resetId,
  resetValue,
  error,
}) {
  const handleClickListItem = () => {
    setOpen(true);
  };

  const handleClose = (newValue?: string) => {
    setOpen(false);
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <List
        component="div"
        role="group"
        className={`bg-[#f1f1f1] w-full border rounded-md ${
          error ? "border-red-600" : "border-transparent"
        }`}
      >
        <div className="flex pb-2 pt-2 pr-2 items-center gap-2">
          <label className=" text-sm block font-bold text-gray-600 ">
            {label}
          </label>
          <div>
            <FormHelperText className="!m-0 !font-bold" error={true}>
              {error}
            </FormHelperText>
          </div>
        </div>
        <div className="flex items-center justify-between w-full gap-5">
          <ListItemButton
            className="w-full !border-0"
            divider
            aria-haspopup="true"
            aria-controls="ringtone-menu"
            aria-label={value}
            onClick={handleClickListItem}
          >
            <ListItemText className="w-auto">
              <span className="text-sm font-bold text-gray-600">
                {value ?? "انتخاب کنید"}
              </span>
            </ListItemText>
          </ListItemButton>
          <IconButton
            onClick={(e) =>
              setValue.setValues({
                ...setValue.values,
                [resetId]: null,
                [resetValue]: null,
              })
            }
          >
            <ClearIcon />
          </IconButton>
        </div>

        <ConfirmationDialogRaw open={open} onClose={handleClose}>
          {children}
        </ConfirmationDialogRaw>
      </List>
    </Box>
  );
}
