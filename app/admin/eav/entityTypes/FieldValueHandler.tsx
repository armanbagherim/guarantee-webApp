import React, { useState } from "react";
import ModalSelect from "@/app/components/admin-components/ModalSelect";
import { Autocomplete, Chip, CircularProgress, TextField } from "@mui/material";
import Map from "@/app/components/admin-components/Map";
import Modal from "@/app/components/admin-components/Modal";
import Input from "@/app/components/admin-components/Input";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import dynamic from "next/dynamic";
import { convertValue } from "@/app/components/utils/ConvertType";
import { Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import LightDataGrid from "@/app/components/admin-components/LightDataGrid/LightDataGrid";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { fetcher, useFetcher } from "@/app/components/admin-components/fetcher";

const SeoBox = dynamic(
  () => import("@/app/admin/ecommerce/products/_components/SeoBox"),
  { ssr: false }
);

const FieldValueHandler = ({
  isOpen,
  loading,
  setIsOpen,
  formik,
  setIsEditFieldValues,
  isEdit,
  triggered,
  setTriggered,
  isEditFieldValues,
}) => {
  const getData = async (id) => {
    const data = await fetcher({
      url: `/v1/api/eav/admin/attributeValues/${id}`,
      method: "GET",
    });

    setIsEditFieldValues({
      open: true,
      id: id,
    });
    formik.setValues({
      ...formik.values,
      value: data.result.value,
      attributeId: +isEditFieldValues.id,
    });
    return data;
  };

  const [value, setValue] = React.useState("1");
  const [operatorsOpen, setOperatorsOpen] = useState(false);
  const [citiesOpen, setCitiesOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);

  const deleteValue = async (id) => {
    try {
      const result = await Swal.fire({
        title: "مطمئن هستید؟",
        text: "با حذف این گزینه امکان بازگشت آن وجود ندارد",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "بله حذفش کن",
        cancelButtonText: "لغو",
      });

      if (result.isConfirmed) {
        const req = await fetcher({
          url: `/v1/api/eav/admin/attributeValues/${id}`,
          method: "DELETE",
        });
        toast.success("موفق");
        setTriggered(!triggered);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const columns = [
    {
      accessorKey: "value",
      header: "نام ",
      minSize: 100, //min size enforced during resizing
      maxSize: 200, //max size enforced during resizing
      size: 200, //medium column
    },

    {
      accessorKey: "Actions",
      header: "عملیات",
      size: 200,

      Cell: ({ row }) => (
        <>
          <IconButton
            onClick={(e) => getData(row.original.id)}
            aria-label="edit"
            color="primary"
          >
            <ModeEditIcon />
          </IconButton>

          <a onClick={(e) => deleteValue(row.id)}>
            <IconButton aria-label="delete" color="error">
              <DeleteIcon />
            </IconButton>
          </a>
        </>
      ),
    },
  ];
  return (
    <Modal
      loading={loading}
      title="مقدار فیلد ها"
      handleClose={() => {
        formik.resetForm();
        setIsOpen({ active: false, loading: false });
      }}
      maxSize="md"
      isOpen={isOpen.active}
      handleAccept={formik.handleSubmit}
      onClick={(e) => {
        setIsEditFieldValues({ open: true, id: null });
        formik.setValues({
          ...formik.values,

          attributeId: +isEditFieldValues.id,
        });
      }}
    >
      <LightDataGrid
        url={`/v1/api/eav/admin/attributeValues?sortOrder=ASC&orderBy=id&ignorePaging=false&attributeId=${isOpen.id}`}
        columns={columns}
        triggered={triggered}
      />
    </Modal>
  );
};

export default FieldValueHandler;
