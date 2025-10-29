"use client";
import React, { useEffect, useState } from "react";
import AddressSection from "./AddressSection";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { fetcher } from "@/app/components/admin-components/fetcher";
import toast from "@/app/components/toast";
import { useRouter } from "next/navigation";
import LightDataGridClient from "@/app/components/admin-components/LightDataGrid/LightDataGridClient";
import { LoadingIcon } from "@/app/components/design/icons";
import Uploader from "@/app/components/design/Uploader";
import { ConvertToNull } from "@/app/components/utils/ConvertToNull";

export default function RequestForm({ requestTypes, session }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [address, setAddress] = useState(null);
  const [allAddresess, setAllAddress] = useState(null);
  const [addressIsOpen, setIsAddressOpen] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [productType, setProductType] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState([]);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemBarcode, setNewItemBarcode] = useState("");
  const router = useRouter();

  // Modal select states
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSelectType, setCurrentSelectType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalData, setModalData] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [endpoint, setEndpoint] = useState("");
  const [photos, setPhotos] = useState([]);
  // Store selected items' titles
  const [selectedProductTypeTitle, setSelectedProductTypeTitle] = useState("");
  const [selectedBrandTitle, setSelectedBrandTitle] = useState("");
  const [selectedVariantTitle, setSelectedVariantTitle] = useState("");

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

    setSubmitLoading(true);
    try {
      const result = await fetcher({
        url: `/v1/api/guarantee/client/requests/outOfWarrantyRequest`,
        method: "POST",
        body: {
          description: description,
          phoneNumber: phoneNumber,
          addressId: +address.id,
          requestTypeId: +selectedType,
          productTypeId: +productType,
          brandId: +selectedBrand,
          variantId: +selectedVariant,
          attachments: photos.map((photo) => ({ attachmentId: photo.id })),
          items: items,
        },
      });
      toast.success("درخواست با موفقیت ثبت شد.");
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

  const openModalSelect = (type) => {
    setCurrentSelectType(type);
    let endpoint = "";
    switch (type) {
      case "productType":
        endpoint = "/v1/api/guarantee/client/productTypes";
        break;
      case "brand":
        endpoint = "/v1/api/guarantee/client/brands";
        break;
      case "variant":
        endpoint = "/v1/api/guarantee/client/variants";
        break;
    }
    setEndpoint(endpoint);
    setModalOpen(true);
  };

  const handleSelectItem = (item) => {
    switch (currentSelectType) {
      case "productType":
        setProductType(item.id);
        setSelectedProductTypeTitle(item.title);
        break;
      case "brand":
        setSelectedBrand(item.id);
        setSelectedBrandTitle(item.title);
        break;
      case "variant":
        setSelectedVariant(item.id);
        setSelectedVariantTitle(item.title);
        break;
    }
    setModalOpen(false);
  };

  const modalColumns = [
    {
      accessorKey: "title",
      header: "عنوان",
    },
    {
      accessorKey: "actions",
      header: "",
      Cell: ({ row }) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSelectItem(row)}
        >
          انتخاب
        </Button>
      ),
    },
  ];

  useEffect(() => {
    getAddresses();
  }, []);

  return (
    <div className="bg-white p-6 rounded-[25px] request">
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
            <InputLabel id="request-type-label">نوع درخواست</InputLabel>
            <Select
              labelId="request-type-label"
              id="request-type-select"
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

        <TextField
          fullWidth
          placeholder="جست و جوی نوع محصول"
          onClick={() => openModalSelect("productType")}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <IconButton onClick={() => openModalSelect("productType")}>
                <SearchIcon />
              </IconButton>
            ),
          }}
          value={selectedProductTypeTitle}
        />

        <TextField
          fullWidth
          placeholder="جست و جوی برند"
          onClick={() => openModalSelect("brand")}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <IconButton onClick={() => openModalSelect("brand")}>
                <SearchIcon />
              </IconButton>
            ),
          }}
          value={selectedBrandTitle}
        />

        <TextField
          fullWidth
          placeholder="جست و جوی مدل دستگاه ها"
          onClick={() => openModalSelect("variant")}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <IconButton onClick={() => openModalSelect("variant")}>
                <SearchIcon />
              </IconButton>
            ),
          }}
          value={selectedVariantTitle}
        />

        <div>
          <TextField
            id="phone-number"
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
        />
      </div>
      <div className="bg-yellow-100 mb-6 text-center text-yellow-700 py-2 px-4 rounded-lg">
        درصورت نیاز به ارسال ویدیو می‌توانید ویدیو خود را به شماره ۰۹۲۰۲۱۸۶۷۸۰
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

        {submitLoading ? (
          <button className="bg-primary p-4 text-white rounded-2xl font-bold text-sm w-full" disabled>
            <LoadingIcon />
          </button>
        ) : (
          <button
            onClick={saveData}
            className="bg-primary p-4 text-white rounded-2xl font-bold text-sm w-full"
          >
            ثبت درخواست
          </button>
        )}
      </div>

      {/* Modal for select inputs */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={fullScreen}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            جستجو و انتخاب{" "}
            {currentSelectType === "productType"
              ? "نوع محصول"
              : currentSelectType === "brand"
                ? "برند"
                : "مدل دستگاه"}
          </span>
          <IconButton
            onClick={() => setModalOpen(false)}
            sx={{ marginLeft: "auto" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <LightDataGridClient
            url={`${endpoint}`}
            columns={modalColumns}
            session={session.token}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="primary">
            بستن
          </Button>
        </DialogActions>
      </Dialog>

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