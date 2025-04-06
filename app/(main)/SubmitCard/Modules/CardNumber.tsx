import React from "react";
import { TextField } from "@mui/material";

export default function CardNumber({ cardNumber, setCardNumber }) {
  return (
    <div className="mb-8">
      <h4 className="text-2xl azarMehr w-full text-center mb-8">
        انتخاب نوع کارت
      </h4>
      <TextField
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        sx={{ "& fieldset": { borderRadius: "20px !important" } }}
        fullWidth
        label="کد گارانتی"
      />
    </div>
  );
}
