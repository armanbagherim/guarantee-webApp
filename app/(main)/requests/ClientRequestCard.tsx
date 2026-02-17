"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import concat from "@/app/components/utils/AddressConcat";
import { Dialog, DialogContent, Skeleton, Avatar, Chip, Button as MuiButton } from "@mui/material";
import Image from "next/image";
import { fetcher } from "@/app/components/admin-components/fetcher";

export default function ClientRequestCard({ request, token }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [loadingAttachments, setLoadingAttachments] = useState(false);

  const getAttachments = async () => {
    if (!request?.id) return;
    setLoadingAttachments(true);
    try {
      const res: any = await fetcher({
        url: `/v1/api/guarantee/client/requestAttachments/requestId/${request.id}?ignorePaging=true&sortOrder=ASC`,
        method: "GET",
      });
      setAttachments(res?.result || []);
    } catch (error) {
      console.error("Error fetching attachments", error);
      setAttachments([]);
    } finally {
      setLoadingAttachments(false);
    }
  };

  useEffect(() => {
    if (attachmentsOpen) {
      getAttachments();
    }
  }, [attachmentsOpen]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("fa-IR");
  };

  const getFileType = (fileName) => {
    const extension = fileName?.split(".").pop()?.toLowerCase();
    return {
      isImage: ["jpg", "jpeg", "png", "gif", "webp"].includes(extension || ""),
      extension,
    };
  };

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
          <MuiButton
            variant="outlined"
            size="small"
            onClick={() => setAttachmentsOpen(true)}
          >
            مشاهده پیوست‌ها
          </MuiButton>
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

      <Dialog
        open={attachmentsOpen}
        onClose={() => setAttachmentsOpen(false)}
        aria-labelledby="attachments-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogContent className="p-4">
          <h2 className="text-xl font-bold mb-6 text-right">پیوست‌های درخواست #{request.id}</h2>

          {loadingAttachments ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="border rounded-lg p-4">
                  <div className="flex justify-between mb-4">
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="text" width={100} />
                  </div>
                  <Skeleton variant="rectangular" width="100%" height={200} className="mb-2" />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="80%" />
                </div>
              ))}
            </div>
          ) : attachments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {attachments.map((item) => {
                const { isImage } = getFileType(item.attachment.fileName);
                const imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/client/requestAttachments/image/${item.attachment.fileName}`;

                return (
                  <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="bg-primary text-white">
                        {item.user?.firstname?.[0]}{item.user?.lastname?.[0]}
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {item.user?.firstname} {item.user?.lastname}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.user?.phoneNumber}
                        </div>
                      </div>
                    </div>

                    <Chip
                      label={item.requestAttachmentType?.title}
                      color="primary"
                      size="small"
                      className="mb-3"
                    />

                    <div className="mb-3 border rounded overflow-hidden bg-white">
                      {isImage ? (
                        <div className="relative h-48 w-full">
                          <Image
                            src={imageUrl}
                            alt={`Attachment ${item.id}`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          فایل غیر تصویری
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <div className="text-gray-500">
                        {formatDate(item.createdAt)}
                      </div>
                      <a
                        href={imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="text-primary hover:underline"
                      >
                        دانلود فایل
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">هیچ پیوستی یافت نشد</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}