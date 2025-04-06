"use client";
import Address from "@/app/components/design/Address";
import React, { useEffect, useState } from "react";
import AddressSection from "./AddressSection";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { fetcher } from "@/app/components/admin-components/fetcher";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function RequestForm({ requestTypes, guarantee }) {
  const [address, setAddress] = useState(null);
  const [allAddresess, setAllAddress] = useState(null);
  const [addressIsOpen, setIsAddressOpen] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter()

  const validateForm = () => {
    if (!phoneNumber || phoneNumber.length !== 11 || !phoneNumber.startsWith("09")) {
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
    return true;
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
          requestTypeId: +selectedType,
          addressId: +address.id,
          guaranteeId: +guarantee.id,
        },
      });
      toast.success("درخواست با موفقیت ثبت شد.");
      setTimeout(() => {
        router.push('/requests')
      }, 2000)
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

  return (
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
          <TextField
            id="outlined-basic"
            label="شماره موبایل"
            variant="outlined"
            fullWidth
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
      </div>

      <div className="relative">
        <label className="absolute right-5 top-5 text-[#535353]">توضیحات</label>
        <textarea
          className="w-full border border-[#eee] rounded-[20px] p-2 pt-14 pr-5 outline-none"
          name=""
          placeholder="برای مثال مایکروویو من چراغ هاش روشن میشه ولی وقتی روی دکمه کلیک میکنیم اتفاقی نمیوفته"
          id=""
          rows={5}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        {submitLoading ? (
          <button className="bg-primary p-4 text-white rounded-2xl font-bold text-sm w-full">
            <svg
              aria-hidden="true"
              className="w-4 h-4 text-gray-200 animate-spin mx-auto fill-white"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
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
    </div>
  );
}