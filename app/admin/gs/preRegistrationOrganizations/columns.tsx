import { Modal, Box, Button, TextField } from "@mui/material";
import { toast } from "react-toastify";
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
  return [
    {
      accessorKey: "title",
      header: "نام نمایندگی",
      Cell: ({ row }) => <span className="mr-4">{row?.original?.title}</span>,
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
            {!row.original.isConfirm && (
              <Button onClick={() => setOpenConfirmModal(true)} color="primary">
                تایید
              </Button>
            )}

            <Button
              onClick={() => deleteEavType(row.original.id)}
              color="error"
            >
              حذف
            </Button>
            <Button onClick={() => setOpenImageModal(true)} color="info">
              مشاهده فایل‌ها
            </Button>

            {/* Image Modal */}
            <Modal
              open={openImageModal}
              onClose={() => setOpenImageModal(false)}
            >
              <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white p-6 rounded-2xl shadow-lg max-h-[80vh] overflow-y-auto">
                <div className="text-lg font-semibold mb-4">
                  فایل‌های پیوست شده
                </div>
                {Object.entries(attachments).map(([key, fileName]) =>
                  fileName ? (
                    <div key={key} className="mb-4">
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
              </Box>
            </Modal>

            {/* Confirm Modal */}
            <Modal
              open={openConfirmModal}
              onClose={() => setOpenConfirmModal(false)}
            >
              <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white p-6 rounded-2xl shadow-lg max-h-[80vh] overflow-y-auto space-y-4">
                <div className="text-lg font-semibold mb-4">
                  اطلاعات تایید نمایندگی
                </div>

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

                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => setOpenConfirmModal(false)}
                    variant="outlined"
                  >
                    لغو
                  </Button>
                  <Button
                    onClick={handleSaveConfirmation}
                    variant="contained"
                    color="primary"
                  >
                    ذخیره
                  </Button>
                </div>
              </Box>
            </Modal>
          </>
        );
      },
    },
  ];
}
