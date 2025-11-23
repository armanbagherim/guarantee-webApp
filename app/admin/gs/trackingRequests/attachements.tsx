import { fetcher } from '@/app/components/admin-components/fetcher';
import { Dialog, DialogContent, Skeleton, Avatar, Chip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
export default function Attachments({ historyOpen, setHistoryOpen }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAttachmentsById = async (id) => {
        if (id) {
            setLoading(true);
            setData([]);
            try {
                const res = await fetcher({
                    url: `/v1/api/guarantee/cartable/requestAttachments/requestId/${id}?ignorePaging=true&sortOrder=ASC`,
                    method: "GET"
                });
                setData(res.result || []);
            } catch (error) {
                console.error("Error fetching attachments:", error);
                setData([]);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (historyOpen.isOpen && historyOpen.requestId) {
            getAttachmentsById(historyOpen.requestId);
        } else {
            setData([]);
        }
    }, [historyOpen.isOpen, historyOpen.requestId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('fa-IR');
    };

    const getFileType = (fileName) => {
        const extension = fileName?.split('.').pop().toLowerCase();
        return {
            isImage: ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension),
            extension
        };
    };

    return (
        <Dialog
            open={historyOpen.isOpen}
            onClose={() => setHistoryOpen(prev => ({ ...prev, isOpen: false }))}
            aria-labelledby="attachments-dialog-title"
            maxWidth="md"
            fullWidth
        >
            <DialogContent className="p-4">
                <h2 className="text-xl font-bold mb-6 text-right">پیوست‌های درخواست #{historyOpen.requestId}</h2>

                {loading ? (
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
                ) : data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.map((item) => {
                            const { isImage } = getFileType(item.attachment.fileName);
                            const imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/cartable/requestAttachments/image/${item.attachment.fileName}`;

                            return (
                                <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                                    {/* Uploader Info */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <Avatar className="bg-primary text-white">
                                            {item.user.firstname?.[0]}{item.user.lastname?.[0]}
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">
                                                {item.user.firstname} {item.user.lastname}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {item.user.phoneNumber}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Attachment Type */}
                                    <Chip
                                        label={item.requestAttachmentType.title}
                                        color="primary"
                                        size="small"
                                        className="mb-3"
                                    />

                                    {/* File Preview */}
                                    <div className="mb-3 border rounded overflow-hidden bg-white">
                                        {isImage ? (
                                            <div className="relative h-48 w-full">
                                                <Image
                                                    src={imageUrl}
                                                    alt={`Attachment ${item.id}`}

                                                    fill
                                                    className="object-contain"
                                                // unoptimized // Remove if using Next.js optimized images
                                                />
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center text-gray-500">
                                                <FileDownloadOutlinedIcon fontSize="large" />
                                                <div className="mt-2">فایل غیر تصویری</div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Meta Info */}
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
                    <div className="text-center py-8 text-gray-500">
                        هیچ پیوستی یافت نشد
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}