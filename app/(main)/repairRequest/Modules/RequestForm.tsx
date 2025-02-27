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

export default function RequestForm() {
  const [address, setAddress] = useState(null);
  const [allAddresess, setAllAddress] = useState(null);
  const [addressIsOpen, setIsAddressOpen] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
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
      <div className="grid grid-cols-3 gap-4 mb-4">
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
              value={null}
              label="نوع درخواست"
              // onChange={handleChange}
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div>
          <TextField
            id="outlined-basic"
            label="شماره موبایل"
            variant="outlined"
            fullWidth
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
        ></textarea>
      </div>
    </div>
  );
}
