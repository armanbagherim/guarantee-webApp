"use client";
import Address from "@/app/components/design/Address";
import React, { useEffect, useState } from "react";
import AddressSection from "./AddressSection";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { fetcher } from "@/app/components/admin-components/fetcher";
import toast from "@/app/components/toast";
import { useRouter } from "next/navigation";
import Uploader from "@/app/components/design/Uploader";
import { ConvertToNull } from "@/app/components/utils/ConvertToNull";

export default function RequestForm({
  requestTypes,
  guaranteeId,
  products,
  session,
}) {
  const [address, setAddress] = useState(null);
  const [allAddresess, setAllAddress] = useState(null);
  const [addressIsOpen, setIsAddressOpen] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
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
    if (!description) {
      toast.error("لطفا توضیحات را وارد کنید.");
      return false;
    }
    if (photos.length === 0) {
      toast.error("لطفا حداقل یک تصویر محصول آپلود کنید.");
      return false;
    }
    return true;
  };

  const saveData = async () => {
    if (!validateForm()) return;

    setSubmitLoading(true);
    try {
      const result = await fetcher({
        url: `/v1/api/guarantee/client/requests/vipRequest`,
        method: "POST",
        body: {
          description: description,
          phoneNumber: phoneNumber,
          requestTypeId: +selectedType,
          addressId: +address.id,
          assignedProductAssignedGuaranteeId: +selectedProduct,
          guaranteeId: +guaranteeId,
          attachments: photos.map((photo) => ({ attachmentId: photo.id })),
        },
      });
      toast.success("درخواست با موفقیت ثبت شد.");
      setRedirecting(true);
      setTimeout(() => {
        router.push("/requests");
      }, 2000);
    } catch (err) {
      toast.error(err.message);
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

  const showFullScreenLoading = submitLoading || redirecting;

  return (
    <div className="relative">
      {showFullScreenLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[999999999] flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl flex items-center gap-3">
            <CircularProgress />
            <span className="text-sm font-semibold">در حال ثبت درخواست...</span>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-[25px] request">
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
              <InputLabel id="demo-simple-select-label">نوع درخواست</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedType}
                label="نوع درخواست"
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {requestTypes.map((value, key) => (
                  <MenuItem key={key} value={value.id}>
                    {value.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">محصول</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedProduct}
                label="محصول"
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                {products.map((value, key) => (
                  <MenuItem key={key} value={value.id}>
                    {value.productType.title} {value.brand.title}{" "}
                    {value.variant.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            <TextField
              id="outlined-basic"
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
          />
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
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <button
            onClick={saveData}
            className="bg-primary mt-4 p-4 text-white rounded-2xl font-bold text-sm w-full"
            disabled={submitLoading || redirecting}
          >
            ثبت درخواست
          </button>
        </div>
      </div>
    </div>
  );
}