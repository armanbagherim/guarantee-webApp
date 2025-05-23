"use client";
import AddressSection from "./AddressSection";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  CircularProgress,
} from "@mui/material";
import { fetcher } from "@/app/components/admin-components/fetcher";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Uploader from "@/app/components/design/Uploader";
import React, { useEffect, useState } from "react";
import { ConvertToNull } from "@/app/components/utils/ConvertToNull";

export default function RequestForm({ requestTypes, guarantee, session }) {
  const [address, setAddress] = useState(null);
  const [allAddresess, setAllAddress] = useState(null);
  const [addressIsOpen, setIsAddressOpen] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const router = useRouter();

  const handlePhoneNumberChange = (value) => {
    // Convert Persian/Arabic numbers to English
    const normalized = ConvertToNull({ value }).value || "";
    setPhoneNumber(normalized);
  };

  const validateForm = () => {
    if (
      !phoneNumber ||
      phoneNumber.length !== 11 ||
      !phoneNumber.startsWith("09")
    ) {
      toast.error("شماره موبایل باید 11 رقم و با 09 شروع شود.");
      return false;
    }
    if (!selectedType) {
      toast.error("لطفا نوع درخواست را انتخاب کنید.");
      return false;
    }
    if (!address) {
      toast.error("لطفا آدرس را انتخاب کنید.");
      return false;
    }
    if (!description || description.trim().length < 5) {
      toast.error("توضیحات باید حداقل ۵ کاراکتر باشد.");
      return false;
    }
    return true;
  };

  const saveData = async () => {
    if (!validateForm()) return;
    if (uploading) {
      toast.warning("لطفا صبر کنید تا آپلود تصاویر کامل شود.");
      return;
    }

    setSubmitLoading(true);
    try {
      const result = await fetcher({
        url: `/v1/api/guarantee/client/requests/normalRequest`,
        method: "POST",
        body: {
          description: description,
          phoneNumber: phoneNumber,
          requestTypeId: +selectedType,
          addressId: +address.id,
          guaranteeId: +guarantee.id,
          attachments: photos.map((photo) => ({ attachmentId: photo.id })),
        },
      });
      toast.success("درخواست با موفقیت ثبت شد.");
      setTimeout(() => {
        router.push("/requests");
      }, 2000);
    } catch (err) {
      toast.error(err.message || "خطا در ثبت درخواست.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const getAddresses = async () => {
    setAddressLoading(true);
    const result = await fetcher({
      url: "/v1/api/guarantee/client/addresses",
      method: "GET",
    });
    setAllAddress(result?.result);
    setAddressLoading(false);
  };

  useEffect(() => {
    getAddresses();
  }, []);

  // ⬇️ کامپوننت لودینگ تمام صفحه داخل همین فایل
  const FullScreenLoader = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[999999999] flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl flex items-center gap-3">
        <CircularProgress />
        <span className="text-sm font-semibold">در حال ثبت درخواست...</span>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-[25px] request relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <AddressSection
          refetch={getAddresses}
          allAddresess={allAddresess}
          setIsAddressOpen={setIsAddressOpen}
          addressIsOpen={addressIsOpen}
          setAddress={setAddress}
          address={address}
          addressLoading={addressLoading}
        />
        <div>
          <FormControl fullWidth>
            <InputLabel id="type-label">نوع درخواست</InputLabel>
            <Select
              labelId="type-label"
              value={selectedType}
              label="نوع درخواست"
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {requestTypes.map((value) => (
                <MenuItem key={value.id} value={value.id}>
                  {value.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div>
          <TextField
            label="شماره موبایل"
            variant="outlined"
            fullWidth
            value={phoneNumber}
            onChange={(e) => handlePhoneNumberChange(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4">
        <span className="mb-3 text-bold block">آپلود تصویر محصول</span>
        <Uploader
          photos={photos}
          setPhotos={setPhotos}
          location={"v1/api/guarantee/client/requests/image"}
          type={"image"}
          isFull={true}
          token={session.token}
          setUploading={setUploading}
        />
        {uploading && (
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <CircularProgress size={18} />
            در حال آپلود تصاویر...
          </div>
        )}
      </div>

      <div className="bg-yellow-100 mb-4 text-center text-yellow-700 py-2 px-4 rounded-lg">
        درصورت نیاز به ارسال ویدیو می‌توانید ویدیو خود را به شماره 09202186780
        در واتساپ یا ایتا ارسال نمایید.
      </div>

      <div className="relative">
        <label className="absolute right-5 top-5 text-[#535353]">
          ایراد / اشکال به اظهار مشتری
        </label>
        <textarea
          className="w-full border border-[#eee] rounded-[20px] p-2 pt-14 pr-5 outline-none"
          placeholder="برای مثال مایکروویو من چراغ‌هاش روشن میشه ولی وقتی روی دکمه کلیک میکنیم اتفاقی نمی‌افته"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="mt-4">
        <button
          onClick={saveData}
          className="bg-primary p-4 text-white rounded-2xl font-bold text-sm w-full disabled:opacity-50"
          disabled={submitLoading || uploading}
        >
          {submitLoading ? (
            <svg
              aria-hidden="true"
              className="w-4 h-4 text-gray-200 animate-spin mx-auto fill-white"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          ) : (
            "ثبت درخواست"
          )}
        </button>
      </div>

      {(submitLoading || uploading) && <FullScreenLoader />}
    </div>
  );
}