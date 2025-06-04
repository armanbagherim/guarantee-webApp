import { fetcher } from "@/app/components/admin-components/fetcher";
import React, { useEffect, useState } from "react";
import toast from "@/app/components/toast";
import { Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Swal from "sweetalert2";
import GavelIcon from "@mui/icons-material/Gavel";

export function columns(
  isEditEav,
  setIsEditEav,
  triggered,
  setTriggered,
  formik,
  setContractsModal
) {
  const getData = async (id: string) => {
    try {
      const res = await fetcher({
        url: `/v1/api/guarantee/admin/guaranteeOrganizations/${id}`,
        method: "GET",
      });
      return res.result;
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteItem = async (id) => {
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
          url: `/v1/api/guarantee/admin/guaranteeOrganizations/${id}`,
          method: "DELETE",
        });
        toast.success("موفق");
        setTriggered(!triggered);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return [
    {
      accessorKey: "organization.name",
      header: "نام نماینده ",
    },

    {
      accessorKey: "user",
      header: "توضیحات",
      Cell: ({ row }) => (
        <span>
          {row?.original?.user?.firstname} {row?.original?.user?.lastname}
        </span>
      ),
    },

    {
      accessorKey: "Actions",
      header: "عملیات",

      Cell: ({ row }) => (
        <>
          <IconButton
            onClick={async (e) => {
              const editData = await getData(row.original.id);
              console.log(editData);

              setIsEditEav({ active: true, id: row.original.id, open: true });

              formik.setValues({
                ...formik.values,
                name: editData.organization.name,
                isNationwide: editData.isNationwide,
                isOnlinePayment: editData.isOnlinePayment,
                code: editData.code,
                licenseDate: editData.licenseDate,
                address: {
                  ...formik.values.address,
                  name: editData.address.name,
                  latitude: editData.address.latitude,
                  longitude: editData.address.longitude,
                  provinceId: editData.address.provinceId,
                  cityId: editData.address.cityId,
                  neighborhoodId: editData.address.neighborhoodId,
                  street: editData.address.street,
                  alley: editData.address.alley,
                  plaque: editData.address.plaque,
                  floorNumber: editData.address.floorNumber,
                  postalCode: editData.address.postalCode,
                },
                user: {
                  ...formik.values.user,
                  firstname: editData.user.firstname,
                  lastname: editData.user.lastname,
                  phoneNumber: editData.user.phoneNumber,
                },
              });
            }}
            aria-label="delete"
            color="primary"
          >
            <ModeEditIcon />
          </IconButton>

          <IconButton
            onClick={async (e) => {
              setContractsModal({
                organizationId: row.original.id,
                open: true,
              });
            }}
            aria-label="delete"
            color="primary"
          >
            <GavelIcon />
          </IconButton>

          <IconButton onClick={(e) => deleteItem(row.id)} aria-label="delete" color="error">
            <DeleteIcon />
          </IconButton>

        </>
      ),
    },
  ];
}
