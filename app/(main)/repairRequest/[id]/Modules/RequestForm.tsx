"use client";
import AddressSection from "./AddressSection";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import { fetcher } from "@/app/components/admin-components/fetcher";
import toast from "@/app/components/toast";
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
  const [items, setItems] = useState([]);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemBarcode, setNewItemBarcode] = useState("");
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

  const handleAddItem = () => {
    if (!newItemTitle.trim()) {
      toast.error("لطفا عنوان را وارد کنید.");
      return;
    }
    const newItem = {
      title: newItemTitle.trim(),
      barcode: newItemBarcode.trim() || null,
    };
    setItems([...items, newItem]);
    setNewItemTitle("");
    setNewItemBarcode("");
    setItemModalOpen(false);
    toast.success("اقلام با موفقیت اضافه شد.");
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
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
          items: items,
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
          <span className="text-sm text-green-800 font-bold mt-2 block">در صورت پاسخگو نبودن شماره دیگری وارد کنید</span>

        </div>
      </div>

      {/* New Section: اقلام همراه با دستگاه - با دیزاین مدرن و Tailwind */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-gray-800">اقلام همراه با دستگاه</span>
          <button
            onClick={() => setItemModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-md transition-all duration-200 transform hover:scale-105"
          >
            + اضافه کردن اقلام
          </button>
        </div>
        {items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex justify-between items-center hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col space-y-1 flex-1">
                  <span className="text-sm font-semibold text-gray-900">{item.title}</span>
                  {item.barcode && (
                    <span className="text-xs text-gray-600">بارکد: {item.barcode}</span>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-sm transition-all duration-200 transform hover:scale-110"
                  title="حذف"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-sm text-gray-500 mb-2">هیچ اقلامی اضافه نشده است.</p>
            <p className="text-xs text-gray-400">برای ثبت اقلام همراه، روی دکمه بالا کلیک کنید.</p>
          </div>
        )}
      </div>

      <div className="mb-6">
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

      <div className="bg-red-100 mb-2 text-center text-red-700 py-2 px-4 rounded-lg">
        لطفا عکس کارت گارانتی را نیز در پیوست ارسال نمایید.
      </div>
      <div className="bg-yellow-100 mb-6 text-center text-yellow-700 py-2 px-4 rounded-lg">
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

      {/* Modal for Adding Items */}
      <Dialog open={itemModalOpen} onClose={() => setItemModalOpen(false)}>
        <DialogTitle>اضافه کردن اقلام همراه با دستگاه</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              id="item-title"
              label="عنوان اقلام"
              type="text"
              fullWidth
              variant="standard"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
            />
            <TextField
              margin="dense"
              id="item-barcode"
              label="بارکد (اختیاری)"
              type="text"
              fullWidth
              variant="standard"
              value={newItemBarcode}
              onChange={(e) => setNewItemBarcode(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setItemModalOpen(false)}>لغو</Button>
          <Button onClick={handleAddItem}>اضافه کردن</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}