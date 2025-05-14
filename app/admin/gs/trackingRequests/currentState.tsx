import { fetcher } from '@/app/components/admin-components/fetcher';
import { Dialog, DialogContent, Skeleton } from '@mui/material';
import React, { useEffect, useState } from 'react';

export default function CurrentState({ historyOpen, setHistoryOpen }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const getCurrentStateById = async (id) => {
        if (id) {
            setLoading(true);
            setData([]); // Clear previous data while loading
            try {
                const res = await fetcher({
                    url: `/v1/api/guarantee/admin/trackingRequests/currentState?requestId=${id}`,
                    method: "GET",
                });
                setData(res.result || []);
            } catch (error) {
                console.error("Error fetching current state:", error);
                setData([]);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (historyOpen.isOpen && historyOpen.requestId) {
            getCurrentStateById(historyOpen.requestId);
        } else {
            setData([]); // Reset data when modal closes
        }
    }, [historyOpen.isOpen, historyOpen.requestId]);

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
                <h2 className="text-xl font-bold mb-6 text-right">
                    وضعیت کنونی درخواست #{historyOpen.requestId}
                </h2>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map((item) => (
                            <div key={item} className="border rounded-lg p-4">
                                <Skeleton variant="text" width={150} className="mb-2" />
                                <Skeleton variant="text" width="100%" />
                                <Skeleton variant="text" width={120} />
                            </div>
                        ))}
                    </div>
                ) : data.length > 0 ? (
                    <div className="space-y-4">
                        {data.map((item, index) => (
                            <div key={index} className="border rounded-lg p-4 bg-gray-50">
                                <div className="text-sm mb-2">
                                    <span className="font-medium">فعالیت: </span>
                                    <span className="py-1 px-2 rounded-lg bg-green-100 text-green-700">
                                        {item.activityName}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <span className="font-medium">کاربران: </span>
                                    {item.users.length > 0 ? (
                                        item.users.map((user) => (
                                            <div
                                                key={user.id}
                                                className="bg-white p-2 rounded border mt-1"
                                            >
                                                {user.firstname} {user.lastname} ({user.phoneNumber})
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-gray-500">بدون کاربر</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        هیچ اطلاعاتی یافت نشد
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}