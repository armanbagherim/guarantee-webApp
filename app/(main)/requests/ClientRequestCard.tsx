"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import concat from "@/app/components/utils/AddressConcat";

export default function ClientRequestCard({ request }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Always Visible Info */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">درخواست #{request.id}</h3>
          <div className="mt-1 text-sm text-gray-600">
            <p>نوع: {request.requestType.title}</p>
            <p>نوع درخواست: {request.requestCategory.title}</p>
            <p>تاریخ ایجاد: {new Date(request.createdAt).toLocaleDateString("fa-IR")}</p>
          </div>
        </div>

        {/* Status and Actions */}
        <div className="flex flex-col items-start sm:items-end gap-2">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${request.organizationId
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
              }`}
          >
            {request.organizationId ? "تایید شده" : "در انتظار بررسی"}
          </span>
          <Link
            href={`/requests/${request.id}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none transition-colors duration-200"
          >
            مشاهده تاریخچه
          </Link>
        </div>
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
      >
        {isExpanded ? "بستن جزئیات" : "نمایش جزئیات"}
        {isExpanded ? (
          <ChevronUpIcon className="h-5 w-5" />
        ) : (
          <ChevronDownIcon className="h-5 w-5" />
        )}
      </button>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
            {/* Product Info */}
            <div>
              <h4 className="text-base font-semibold text-gray-800">اطلاعات محصول</h4>
              <div className="mt-2 space-y-1">
                <p>
                  <span className="font-medium">برند:</span> {request.brand.title}
                </p>
                <p>
                  <span className="font-medium">نوع محصول:</span>{" "}
                  {request.productType.title}
                </p>
                <p>
                  <span className="font-medium">مدل:</span> {request.variant.title}
                </p>
                <p>
                  <span className="font-medium">کد گارانتی:</span> {request.guaranteeId}
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-base font-semibold text-gray-800">اطلاعات تماس</h4>
              <div className="mt-2 space-y-1">
                <p>
                  <span className="font-medium">شماره تماس:</span> {request.phoneNumber}
                </p>
                <p>{concat(request.address)}</p>
              </div>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            آخرین بروزرسانی: {new Date(request.updatedAt).toLocaleString("fa-IR")}
          </div>
        </div>
      )}
    </div>
  );
}