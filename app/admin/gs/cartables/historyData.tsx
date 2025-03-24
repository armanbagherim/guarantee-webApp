import { fetcher } from '@/app/components/admin-components/fetcher';
import { Dialog, DialogContent, Skeleton } from '@mui/material';
import React, { useEffect, useState } from 'react'

export default function HistoryData({ historyOpen, setHistoryOpen }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const getHistoryById = async (id) => {
        if (historyOpen.requestId) {
            setLoading(true);
            try {
                const res = await fetcher({
                    url: `/v1/api/guarantee/cartable/histories/requestId/${id}?ignorePaging=true`,
                    method: "GET"
                });
                setData(res.result || []);
            } catch (error) {
                console.error("Error fetching history:", error);
                setData([]);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        getHistoryById(historyOpen.requestId);
    }, [historyOpen.requestId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('fa-IR'); // Persian locale
    };

    return (
        <Dialog
            open={historyOpen.isOpen}
            onClose={() => setHistoryOpen((prev) => ({ ...prev, isOpen: false }))}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="sm"
            fullWidth
        >
            <DialogContent className="p-4">
                <h2 className="text-xl font-bold mb-6 text-right">تاریخچه درخواست #{historyOpen.requestId}</h2>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map((item) => (
                            <div key={item} className="border rounded-lg p-4">
                                <div className="flex justify-between mb-2">
                                    <Skeleton variant="text" width={100} />
                                    <Skeleton variant="text" width={100} />
                                </div>
                                <Skeleton variant="text" width={80} className="mb-2" />
                                <Skeleton variant="text" width="100%" />
                                <Skeleton variant="text" width={120} className="mt-2" />
                            </div>
                        ))}
                    </div>
                ) : data.length > 0 ? (
                    <div className="space-y-4">
                        {data.map((item) => (
                            <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                                <div className="flex justify-between mb-2">
                                    <div className="text-sm text-gray-600">
                                        <span className="font-medium">از: </span>
                                        {item.from}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <span className="font-medium">به: </span>
                                        {item.to}
                                    </div>
                                </div>
                                <div className="text-sm mb-2">
                                    <span className="font-medium">عملیات: </span>
                                    {item.nodeCommand}
                                </div>
                                <div className="text-sm mb-2 bg-white p-2 rounded border">
                                    <span className="font-medium">توضیحات: </span>
                                    {item.description}
                                </div>
                                <div className="text-xs text-gray-500 text-left">
                                    {formatDate(item.createdAt)}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        هیچ تاریخچه‌ای یافت نشد
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}