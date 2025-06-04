import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  TextField,
} from "@mui/material";
import toast from "@/app/components/toast";
import Swal from "sweetalert2";
import { useState } from "react";
import { fetcher } from "@/app/components/admin-components/fetcher";
import Image from "next/image";
import DatePickerPersian from "@/app/components/utils/DatePicker";

const attachmentLabels = {
  license: "تصویر پروانه کسب",
  national: "تصویر کارت ملی",
  estate: "تصویر نمای بیرون واحد صنفی",
  postal: "تصویر نمای داخل واحد صنفی",
};

export function columns(isEditEav, setIsEditEav, triggered, setTriggered) {
  const rejectEavType = async (id) => {
    const { value: rejectDescription } = await Swal.fire({
      title: "رد درخواست",
      input: "textarea",
      inputLabel: "دلیل رد درخواست را وارد کنید",
      inputPlaceholder: "دلیل رد را اینجا بنویسید...",
      showCancelButton: true,
      confirmButtonText: "رد درخواست",
      cancelButtonText: "لغو",
      inputValidator: (value) => {
        if (!value) return "دلیل رد درخواست الزامی است";
      },
    });

    if (rejectDescription) {
      try {
        await fetcher({
          url: `/v1/api/guarantee/admin/preRegistrationOrganizations/${id}`,
          method: "DELETE",
          body: { rejectDescription },
        });
        toast.success("درخواست با موفقیت رد شد");
        setTriggered((prev) => !prev);
      } catch (err) {
        toast.error(err.message);
      }
    }
  };
  return [
    {
      accessorKey: "title",
      header: "نام نمایندگی",
      Cell: ({ row }) => <span className="mr-4">{row?.original?.title}</span>,
    },
    {
      accessorKey: "licenseCode",
      header: "شناسه جواز کسب",
    },
    {
      accessorKey: "firstname",
      header: "نام",
      Cell: ({ row }) => (
        <span className="mr-4">{row?.original?.firstname}</span>
      ),
    },
    {
      accessorKey: "lastname",
      header: "نام خانوادگی",
      Cell: ({ row }) => (
        <span className="mr-4">{row?.original?.lastname}</span>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: "شماره تماس",
      Cell: ({ row }) => (
        <span className="mr-4">{row?.original?.phoneNumber}</span>
      ),
    },
    {
      accessorKey: "address",
      header: "آدرس کامل",
      Cell: ({ row }) => {
        const addr = row?.original?.address;
        if (!addr) return "—";

        const {
          province,
          city,
          neighborhood,
          street,
          alley,
          plaque,
          floorNumber,
          postalCode,
        } = addr;

        return (
          <div className="text-right text-sm leading-6">
            {province?.name}، {city?.name}، {neighborhood?.name}
            <br />
            {street && `خیابان ${street}`}
            {alley && `، کوچه ${alley}`}
            {plaque && `، پلاک ${plaque}`}
            {floorNumber && `، طبقه ${floorNumber}`}
            {postalCode && <div>کد پستی: {postalCode}</div>}
          </div>
        );
      },
    },
    {
      accessorKey: "Actions",
      header: "عملیات",
      Cell: ({ row }) => {
        const [openImageModal, setOpenImageModal] = useState(false);
        const [openConfirmModal, setOpenConfirmModal] = useState(false);

        const [startDate, setStartDate] = useState(null);
        const [endDate, setEndDate] = useState(null);
        const [licenseDate, setLicenseDate] = useState(null);
        const [representativeShare, setRepresentativeShare] = useState("");
        const [organizationCode, setOrganizationCode] = useState("");

        const resetFields = () => {
          setStartDate(null);
          setEndDate(null);
          setLicenseDate(null);
          setRepresentativeShare("");
          setOrganizationCode("");
        };

        const attachments = {
          license: row.original.licenseAttachment?.fileName,
          national: row.original.nationalAttachment?.fileName,
          estate: row.original.estateAttachment?.fileName,
          postal: row.original.postalAttachment?.fileName,
        };

        const deleteEavType = async (id) => {
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
            try {
              await fetcher({
                url: `/v1/api/guarantee/admin/preRegistrationOrganizations/${id}`,
                method: "DELETE",
              });
              toast.success("موفق");
              setTriggered((prev) => !prev);
            } catch (err) {
              toast.error(err.message);
            }
          }
        };

        const handleSaveConfirmation = async () => {
          try {
            await fetcher({
              url: `/v1/api/guarantee/admin/preRegistrationOrganizations/${row.original.id}`,
              method: "PATCH",
              body: {
                startDate,
                endDate,
                representativeShare,
                organizationCode,
              },
            });
            toast.success("تایید با موفقیت انجام شد");
            setTriggered((prev) => !prev);
            setOpenConfirmModal(false);
            resetFields();
          } catch (err) {
            toast.error(err.message);
          }
        };

        return (
          <>
            <Button onClick={() => setOpenConfirmModal(true)} color="primary">
              تایید
            </Button>
            {!row.original.isConfirm && (
              <Button
                onClick={() => rejectEavType(row.original.id)}
                color="error"
              >
                رد درخواست
              </Button>
            )}

            <Button onClick={() => setOpenImageModal(true)} color="info">
              مشاهده فایل‌ها
            </Button>

            {/* Image Dialog */}
            <Dialog
              open={openImageModal}
              onClose={() => setOpenImageModal(false)}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>فایل‌های پیوست شده</DialogTitle>
              <DialogContent dividers className="space-y-4">
                {Object.entries(attachments).map(([key, fileName]) =>
                  fileName ? (
                    <div key={key}>
                      <div className="text-gray-700 mb-1">
                        {attachmentLabels[key]}
                      </div>
                      <Image
                        width={100}
                        height={100}
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/admin/preRegistrationOrganizations/image/${fileName}`}
                        alt={attachmentLabels[key]}
                        className="w-full rounded-lg border"
                      />
                    </div>
                  ) : null
                )}
              </DialogContent>
            </Dialog>

            {/* Confirm Dialog */}
            <Dialog
              open={openConfirmModal}
              onClose={() => setOpenConfirmModal(false)}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>اطلاعات تایید نمایندگی</DialogTitle>
              <DialogContent dividers className="space-y-4 mb-12">
                <DatePickerPersian
                  label="تاریخ شروع"
                  date={startDate}
                  onChange={(e) => setStartDate(new Date(e).toISOString())}
                />

                <DatePickerPersian
                  label="تاریخ پایان"
                  date={endDate}
                  onChange={(e) => setEndDate(new Date(e).toISOString())}
                />

                <TextField
                  fullWidth
                  label="سهم نماینده"
                  value={representativeShare}
                  onChange={(e) => setRepresentativeShare(+e.target.value)}
                />

                <TextField
                  fullWidth
                  label="کد نماینده"
                  value={organizationCode}
                  onChange={(e) => setOrganizationCode(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenConfirmModal(false)}>لغو</Button>
                <Button
                  onClick={handleSaveConfirmation}
                  variant="contained"
                  color="primary"
                >
                  ذخیره
                </Button>
              </DialogActions>
            </Dialog>
          </>
        );
      },
    },
  ];
}
