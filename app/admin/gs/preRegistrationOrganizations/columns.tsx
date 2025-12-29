import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Chip,
  Grid,
  IconButton,
  Tooltip,
  TextField,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  CheckCircle as ConfirmIcon,
  Cancel as RejectIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import toast from "@/app/components/toast";
import Swal from "sweetalert2";
import { useState } from "react";
import { fetcher } from "@/app/components/admin-components/fetcher";
import Image from "next/image";
import DatePickerPersian from "@/app/components/utils/DatePicker";

const attachmentLabels = {
  license: "پروانه کسب",
  national: "کارت ملی",
  estate: "نمای بیرونی",
  postal: "نمای داخلی",
};

export function columns(isEditEav, setIsEditEav, triggered, setTriggered) {
  const rejectEavType = async (id) => {
    const { value: rejectDescription } = await Swal.fire({
      title: "رد درخواست",
      input: "textarea",
      inputLabel: "دلیل رد درخواست",
      inputPlaceholder: "دلیل را وارد کنید...",
      showCancelButton: true,
      confirmButtonText: "رد کن",
      cancelButtonText: "لغو",
      inputValidator: (value) => !value && "وارد کردن دلیل الزامی است",
    });

    if (rejectDescription) {
      try {
        await fetcher({
          url: `/v1/api/guarantee/admin/preRegistrationOrganizations/${id}`,
          method: "DELETE",
          body: { rejectDescription },
        });
        toast.success("درخواست رد شد");
        setTriggered((prev) => !prev);
      } catch (err) {
        toast.error(err.message || "خطا در رد درخواست");
      }
    }
  };

  return [
    {
      accessorKey: "title",
      header: "نام واحد صنفیس",
      Cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
    },
    {
      accessorKey: "licenseCode",
      header: "شناسه جواز کسب",
      Cell: ({ row }) => <code className="text-xs px-2 py-1 bg-gray-100 rounded">{row.original.licenseCode || "—"}</code>,
    },
    {
      accessorKey: "firstname",
      header: "نام و نام خانوادگی",
      Cell: ({ row }) => (
        <span className="font-medium">
          {row.original.firstname} {row.original.lastname}
        </span>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: "شماره تماس",
      Cell: ({ row }) => <span dir="ltr" className="font-mono text-sm">{row.original.phoneNumber}</span>,
    },
    {
      accessorKey: "isConfirm",
      header: "وضعیت",
      Cell: ({ row }) => (
        <Chip
          label={
            row.original.isConfirm === true
              ? "تایید شده"
              : row.original.isConfirm === false
                ? "رد شده"
                : "در انتظار"
          }
          color={
            row.original.isConfirm === true
              ? "success"
              : row.original.isConfirm === false
                ? "error"
                : "warning"
          }
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      accessorKey: "Actions",
      header: "عملیات",
      enableSorting: false,
      size: 180,
      Cell: ({ row }) => {
        const data = row.original;

        const [openDetails, setOpenDetails] = useState(false);
        const [openImages, setOpenImages] = useState(false);
        const [openConfirm, setOpenConfirm] = useState(false);

        const [startDate, setStartDate] = useState(null);
        const [endDate, setEndDate] = useState(null);
        const [representativeShare, setRepresentativeShare] = useState("");
        const [organizationCode, setOrganizationCode] = useState("");

        const resetFields = () => {
          setStartDate(null);
          setEndDate(null);
          setRepresentativeShare("");
          setOrganizationCode("");
        };

        const attachments = {
          license: data.licenseAttachment?.fileName,
          national: data.nationalAttachment?.fileName,
          estate: data.estateAttachment?.fileName,
          postal: data.postalAttachment?.fileName,
        };

        const handleConfirm = async () => {
          try {
            await fetcher({
              url: `/v1/api/guarantee/admin/preRegistrationOrganizations/${data.id}`,
              method: "PATCH",
              body: {
                startDate,
                endDate,
                representativeShare: +representativeShare || 0,
                organizationCode,
              },
            });
            toast.success("نمایندگی تایید شد");
            setTriggered((prev) => !prev);
            setOpenConfirm(false);
            resetFields();
          } catch (err) {
            toast.error(err.message || "خطا در تایید");
          }
        };

        return (
          <div className="flex items-center gap-1">

            {/* آیکون جزئیات کامل */}
            <Tooltip title="جزئیات کامل" arrow>
              <IconButton size="small" color="info" onClick={() => setOpenDetails(true)}>
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* آیکون تایید (فقط اگر هنوز تایید نشده) */}
            {data.isConfirm === null && (
              <Tooltip title="تایید نمایندگی" arrow>
                <IconButton size="small" color="success" onClick={() => setOpenConfirm(true)}>
                  <ConfirmIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {/* آیکون رد درخواست */}
            {data.isConfirm === null && (
              <Tooltip title="رد درخواست" arrow>
                <IconButton size="small" color="error" onClick={() => rejectEavType(data.id)}>
                  <RejectIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {/* آیکون مشاهده تصاویر */}
            <Tooltip title="مشاهده تصاویر" arrow>
              <IconButton size="small" color="secondary" onClick={() => setOpenImages(true)}>
                <ImageIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* مودال جزئیات کامل */}
            <Dialog open={openDetails} onClose={() => setOpenDetails(false)} maxWidth="lg" fullWidth>
              <DialogTitle className="text-center font-bold text-lg">
                واحد صنفی: {data.title}
              </DialogTitle>
              <DialogContent dividers>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" className="font-bold mb-3 text-primary">
                      اطلاعات مالک و جواز
                    </Typography>
                    <div className="space-y-3 text-sm">
                      <div><strong>نام:</strong> {data.firstname} {data.lastname}</div>
                      <div><strong>موبایل:</strong> {data.phoneNumber}</div>
                      <div><strong>شناسه جواز کسب:</strong> {data.licenseCode || "ندارد"}</div>
                      <div><strong>تاریخ صدور جواز کسب:</strong> {new Date(data.licenseDate).toLocaleDateString("fa-IR")}</div>
                      <div><strong>وضعیت:</strong> <Chip label={data.isConfirm === null ? "در انتظار" : "تایید شده"} color="warning" size="small" /></div>
                    </div>

                    <Divider className="my-5" />

                    <Typography variant="subtitle1" className="font-bold mb-3 text-primary">
                      آدرس کامل
                    </Typography>
                    <div className="text-sm leading-7 bg-gray-50 p-4 rounded-lg">
                      {data.address?.province?.name && `${data.address.province.name}، `}
                      {data.address?.city?.name && `${data.address.city.name}`}
                      <br />
                      {data.address?.street && `خیابان ${data.address.street}`}
                      {data.address?.alley && `، کوچه ${data.address.alley}`}
                      {data.address?.plaque && `، پلاک ${data.address.plaque}`}
                      {data.address?.floorNumber && `، طبقه ${data.address.floorNumber}`}
                      {data.address?.postalCode && <><br /><strong>کد پستی:</strong> {data.address.postalCode}</>}
                    </div>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" className="font-bold mb-3 text-primary">
                      تصاویر پیوست شده
                    </Typography>
                    <Grid container spacing={2}>
                      {Object.entries(attachments).map(([key, fileName]) =>
                        fileName ? (
                          <Grid item xs={6} key={key}>
                            <p className="text-xs text-center text-gray-600 mb-2 font-medium">
                              {attachmentLabels[key]}
                            </p>
                            <Image
                              src={`${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/admin/preRegistrationOrganizations/image/${fileName}`}
                              alt={attachmentLabels[key]}
                              width={400}
                              height={400}
                              className="rounded-lg shadow-md w-full h-auto object-cover border"
                            />
                          </Grid>
                        ) : null
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDetails(false)}>بستن</Button>
              </DialogActions>
            </Dialog>

            {/* مودال تصاویر جداگانه */}
            <Dialog open={openImages} onClose={() => setOpenImages(false)} maxWidth="md" fullWidth>
              <DialogTitle>تصاویر پیوست شده</DialogTitle>
              <DialogContent dividers className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(attachments).map(([key, fileName]) =>
                  fileName ? (
                    <div key={key} className="text-center">
                      <p className="mb-3 font-medium">{attachmentLabels[key]}</p>
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/admin/preRegistrationOrganizations/image/${fileName}`}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full h-auto rounded-xl shadow-lg"
                        alt={attachmentLabels[key]}
                      />
                    </div>
                  ) : null
                )}
              </DialogContent>
            </Dialog>

            {/* مودال تایید */}
            <Dialog open={openConfirm} onClose={() => { setOpenConfirm(false); resetFields(); }} maxWidth="sm" fullWidth>
              <DialogTitle>تایید نمایندگی</DialogTitle>
              <DialogContent dividers className="space-y-4">
                <DatePickerPersian label="تاریخ شروع" date={startDate} onChange={(e) => setStartDate(new Date(e).toISOString())} />
                <DatePickerPersian label="تاریخ پایان" date={endDate} onChange={(e) => setEndDate(new Date(e).toISOString())} />
                <TextField fullWidth label="سهم نماینده (%)" type="number" value={representativeShare} onChange={(e) => setRepresentativeShare(e.target.value)} />
                <TextField fullWidth label="کد سازمانی" value={organizationCode} onChange={(e) => setOrganizationCode(e.target.value)} />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => { setOpenConfirm(false); resetFields(); }}>لغو</Button>
                <Button onClick={handleConfirm} variant="contained" color="success">
                  تایید و ذخیره
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        );
      },
    },
  ];
}