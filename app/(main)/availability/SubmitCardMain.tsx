"use client";
import React, { useState } from "react";
import { ConvertToNull } from "@/app/components/utils/ConvertToNull";
import { fetcher } from "@/app/components/admin-components/fetcher";

export default function SubmitCardMain() {
  const [cardNumber, setCardNumber] = useState("");
  const [guarantee, setGuarantee] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCardNumberChange = (e) => {
    const normalized = ConvertToNull({ value: e.target.value }).value || "";
    setCardNumber(normalized);
  };

  const handleCheckGuarantee = async () => {
    setLoading(true);
    setError("");
    setGuarantee(null);

    if (!cardNumber) {
      setError("لطفاً شماره کارت را وارد کنید.");
      setLoading(false);
      return;
    }

    try {
      const result = await fetcher({
        url: `/v1/api/guarantee/client/normalGuarantee/availability/${cardNumber}`,
        method: "GET",
      });

      setGuarantee(result.result);
    } catch (err) {
      setError(err.message || "خطا در استعلام کارت.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-md mx-auto mt-2 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-center">
        استعلام کارت گارانتی
      </h2>

      <input
        type="text"
        value={cardNumber}
        onChange={handleCardNumberChange}
        placeholder="شماره کارت گارانتی"
        className="w-full p-3 border rounded mb-4"
      />

      <button
        onClick={handleCheckGuarantee}
        disabled={loading}
        className="w-full bg-primary text-white py-3 rounded font-bold"
      >
        {loading ? "در حال بررسی..." : "استعلام"}
      </button>

      {error && (
        <div className="mt-4 text-red-600 text-sm font-semibold">{error}</div>
      )}

      {guarantee && (
        <div className="mt-4 p-4 bg-green-50 border border-green-300 rounded text-sm text-green-800 space-y-2">
          <div>📄 شماره کارت گارانتی: {guarantee.serialNumber}</div>
          <div>🏷️ برند: {guarantee.brand?.title}</div>
          <div>🧾 مدل: {guarantee.variant?.title}</div>
          <div>🛠️ نوع محصول: {guarantee.productType?.title}</div>
          <div>⏳ دوره گارانتی: {guarantee.guaranteePeriod?.title}</div>
          <div>📅 تاریخ شروع: {formatDate(guarantee.startDate)}</div>
          <div>📅 تاریخ پایان: {formatDate(guarantee.endDate)}</div>
        </div>
      )}
    </div>
  );
}
