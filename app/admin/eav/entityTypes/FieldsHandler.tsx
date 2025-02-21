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

const FieldsHandler = ({
  isOpen,
  setIsOpen,
  loading,
  formik,
  parentEntityTypes,
  parentEntityTypesIsLoading,
  isEditEav,
  eavEditData,
  setIsEditEav,
  isEdit,
  triggered,
  setTriggered,
  setIsEditFieldValues,
}) => {
  const getData = async (id) => {
    const data = await fetcher({
      url: `/v1/api/eav/admin/attributes/${id}`,
      method: "GET",
    });

    return data;
  };

  const [value, setValue] = React.useState("1");
  const [operatorsOpen, setOperatorsOpen] = useState(false);
  const [citiesOpen, setCitiesOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);

  const deleteGuarantee = async (id) => {
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
          url: `/v1/api/eav/admin/attributes/${id}`,
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
      accessorKey: "name",
      header: "نام ",
      size: 120,
    },
    {
      accessorKey: "minLength",
      header: "حداقل طول کاراکتر ",
      size: 120,
    },
    {
      accessorKey: "maxLength",
      header: "حداکثر طول کاراکتر ",
      size: 120,
    },
    {
      accessorKey: "required",
      header: "نوع",
      minSize: 100, //min size enforced during resizing
      maxSize: 200, //max size enforced during resizing
      size: 200, //medium column
      Cell({ row }) {
        return !row.original.required ? "غیراجباری" : "اجباری";
      },
    },
    {
      accessorKey: "attributeType.name",
      header: "نوع فیلد",
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
          {row?.original?.attributeType?.valueBased == true ? (
            <Button
              onClick={() => {
                setIsEditFieldValues({
                  open: true,
                  active: true,
                  id: row.original.id,
                });
              }}
              type="button"
              variant="outlined"
            >
              مقادیر
            </Button>
          ) : (
            ""
          )}

          <IconButton
            onClick={(e) => deleteGuarantee(row.id)}
            aria-label="delete"
            color="error"
          >
            <DeleteIcon />
          </IconButton>

          {/* isOpen.id */}
          <IconButton
            onClick={async (e) => {
              const data = await getData(row.original.id);
              formik.setValues({
                ...formik.values,
                name: data.result.name,
                required:
                  data.result.required === null ? false : data.result.required,
                attributeTypeId: +data.result.attributeTypeId,
                entityTypeId: +isEdit.id,
                minLength: data.result.minLength
                  ? +data.result.minLength
                  : null,
                maxLength: data.result.maxLength
                  ? +data.result.maxLength
                  : null,
              });
              setIsEditEav({ open: true, id: row.original.id });
            }}
            aria-label="delete"
            color="primary"
          >
            <ModeEditIcon />
          </IconButton>
        </>
      ),
    },
  ];
  return (
    <Modal
      loading={loading}
      title="فیلد ها"
      handleClose={() => {
        formik.resetForm();
        setIsOpen({ active: false, loading: false });
      }}
      maxSize="md"
      isOpen={isOpen.active}
      handleAccept={formik.handleSubmit}
      hasAccept={false}
      onClick={(e) => {
        setIsEditEav({ open: true, id: null });
        formik.setValues({
          ...formik.values,

          entityTypeId: +isEdit.id,
        });
      }}
    >
      {" "}
      <LightDataGrid
        url={`/v1/api/eav/admin/attributes?sortOrder=DESC&offset=0&limit=10&orderBy=id&ignorePaging=false&entityTypeId=${isOpen.id}`}
        columns={columns}
        triggered={triggered}
      />
    </Modal>
  );
};

export default FieldsHandler;
