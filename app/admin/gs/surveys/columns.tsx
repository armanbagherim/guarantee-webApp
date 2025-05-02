import { Modal, Box, Button } from "@mui/material";
import Link from "next/link";
import { useState } from "react";

export function columns(
  isEditEav,
  setIsEditEav,
  triggered,
  setTriggered,
  formik
) {
  return [
    {
      accessorKey: "user.firstname",
      header: "نام و نام خانوادگی ",
      Cell: ({ row }) => (
        <span className="mr-4">
          {row?.original?.user?.firstname} {row?.original?.user?.lastname}
        </span>
      ),
    },
    {
      accessorKey: "user.phoneNumber",
      header: "شماره موبایل ",
      Cell: ({ row }) => (
        <span className="mr-4">{row?.original?.user?.phoneNumber}</span>
      ),
    },
    {
      accessorKey: "totalScore",
      header: "امتیاز کلی",
      Cell: ({ row }) => (
        <span className="mr-4">
          {row?.original?.totalScore} از {row?.original?.fromScore}
        </span>
      ),
    },
    {
      accessorKey: "Actions",
      header: "عملیات",
      Cell: ({ row }) => {
        const [open, setOpen] = useState(false);
        const handleOpen = () => setOpen(true);
        const handleClose = () => setOpen(false);
        const answers = row?.original?.answerRecords || [];

        return (
          <>
            <Button onClick={handleOpen} color="primary">
              مشاهده نظرسنجی
            </Button>
            <Link href={`/admin/gs/trackingRequests?requestId=${row.original.requestId}`}>مشاهده درخواست</Link>
            <Modal open={open} onClose={handleClose}>
              <Box
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white p-6 rounded-2xl shadow-lg max-h-[80vh] overflow-y-auto"
              >
                <div className="text-lg font-semibold mb-4">
                  پاسخ‌های نظرسنجی
                </div>
                {answers.length === 0 ? (
                  <div className="text-gray-600">هیچ پاسخی موجود نیست.</div>
                ) : (
                  answers.map((ans) => (
                    <div key={ans.id} className="mb-2 rounded-xl bg-gray-100 py-3 px-4">
                      <div className="font-bold text-md text-gray-800">
                        {ans.question?.title}
                      </div>
                      <div className="text-gray-700 mt-1">
                        پاسخ: <span className="text-sm">{ans.answerOption?.title}</span>{" "}
                        <span className="text-sm text-gray-500">(امتیاز: {ans.weight})</span>
                      </div>
                    </div>
                  ))
                )}
              </Box>
            </Modal>
          </>
        );
      },
    },
  ];
}
