"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { fetcher } from "@/app/components/admin-components/fetcher";
import LightDataGrid from "@/app/components/admin-components/LightDataGrid/LightDataGrid";

export const ModalSelect = ({
  endpoint,
  labelKey,
  valueKey,
  onChange,
  token,
  placeholder,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [triggered, setTriggered] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const columns = [
    {
      accessorKey: labelKey,
      header: "عنوان",
    },
    {
      accessorKey: "actions",
      header: "عملیات",
      Cell: ({ row }) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedItem(row.original);
            onChange(row.original[valueKey]);
            setOpen(false);
          }}
        >
          انتخاب
        </Button>
      ),
    },
  ];

  const handleOpen = () => {
    setOpen(true);
    setTriggered(!triggered);
  };

  return (
    <>
      <TextField
        fullWidth
        placeholder={placeholder}
        onClick={handleOpen}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <IconButton onClick={handleOpen}>
              <SearchIcon />
            </IconButton>
          ),
        }}
        value={selectedItem ? selectedItem[labelKey] : ""}
      />

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>جستجو و انتخاب</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            placeholder="جستجو..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton>
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
          <LightDataGrid
            triggered={triggered}
            url={`${endpoint}?search=${searchTerm}`}
            columns={columns}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            بستن
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
