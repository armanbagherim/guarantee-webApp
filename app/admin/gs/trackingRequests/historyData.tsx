import { fetcher } from '@/app/components/admin-components/fetcher';
import { Dialog, DialogContent, Skeleton, Button, Chip, Avatar, Typography, Box, Divider } from '@mui/material';
import React, { useEffect, useState, useMemo } from 'react';
import { History, Restore, ArrowBack } from '@mui/icons-material';

export default function HistoryData({ historyOpen, setHistoryOpen }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [revertLoading, setRevertLoading] = useState({});

    const getHistoryById = async (id) => {
        if (id) {
            setLoading(true);
            setData([]);
            try {
                const res = await fetcher({
                    url: `/v1/api/guarantee/cartable/histories/requestId/${id}?ignorePaging=true&sortOrder=ASC`,
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

    const handleRevert = async (executeBundle) => {
        if (!historyOpen.requestId || !executeBundle) return;

        const bundleKey = executeBundle;
        setRevertLoading((prev) => ({ ...prev, [bundleKey]: true }));

        try {
            const res = await fetcher({
                url: `/v1/api/guarantee/cartable/revert-request/byHistory`,
                method: "POST",
                body: {
                    requestId: parseInt(historyOpen.requestId, 10),
                    executeBundle: executeBundle
                }
            });
            console.log("Revert successful:", res);
            // Optionally refresh data after successful revert
            getHistoryById(historyOpen.requestId);
        } catch (error) {
            console.error("Error reverting to stage:", error);
        } finally {
            setRevertLoading((prev) => ({ ...prev, [bundleKey]: false }));
        }
    };

    useEffect(() => {
        if (historyOpen.isOpen && historyOpen.requestId) {
            getHistoryById(historyOpen.requestId);
        } else {
            setData([]);
        }
    }, [historyOpen.isOpen, historyOpen.requestId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('fa-IR');
    };

    // Group data by executeBundle and sort by creation date
    const groupedData = useMemo(() => {
        const groups = {};
        data.forEach((item) => {
            const bundle = item.executeBundle;
            if (!groups[bundle]) {
                groups[bundle] = [];
            }
            groups[bundle].push(item);
        });
        
        // Sort items within each bundle by creation date
        Object.keys(groups).forEach(bundle => {
            groups[bundle].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        });
        
        return groups;
    }, [data]);

    // Get a color for the node command
    const getCommandColor = (command) => {
        const commandColors = {
            'APPROVE': '#4caf50',
            'REJECT': '#f44336',
            'EDIT': '#2196f3',
            'FORWARD': '#ff9800',
            'CREATE': '#9c27b0'
        };
        return commandColors[command] || '#607d8b';
    };

    return (
        <Dialog
            open={historyOpen.isOpen}
            onClose={() => setHistoryOpen((prev) => ({ ...prev, isOpen: false }))}
            aria-labelledby="history-dialog-title"
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }
            }}
        >
            <DialogContent className="p-0">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                                <History />
                            </Avatar>
                            <div>
                                <Typography variant="h5" component="h2" fontWeight="bold">
                                    تاریخچه درخواست
                                </Typography>
                                <Typography variant="body2">
                                    شماره درخواست: #{historyOpen.requestId}
                                </Typography>
                            </div>
                        </div>
                        <Button
                            variant="text"
                            color="inherit"
                            onClick={() => setHistoryOpen((prev) => ({ ...prev, isOpen: false }))}
                            sx={{ minWidth: 'auto', p: 1 }}
                        >
                            ✕
                        </Button>
                    </div>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="flex gap-4">
                                    <Skeleton variant="circular" width={40} height={40} />
                                    <div className="flex-1">
                                        <Skeleton variant="text" width="40%" height={24} />
                                        <Skeleton variant="text" width="100%" height={20} />
                                        <Skeleton variant="text" width="80%" height={20} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : Object.keys(groupedData).length > 0 ? (
                        <div className="relative">
                            {/* Timeline line */}
                            
                            
                            {Object.entries(groupedData).map(([bundle, items], bundleIndex) => (
                                <div key={bundle} className="relative mb-8">
                                    {/* Bundle header with revert button */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center z-10">
                                                <span className="text-blue-600 font-bold">{bundleIndex + 1}</span>
                                            </div>
                                            <Typography variant="h6" fontWeight="medium">
                                                مرحله {bundleIndex + 1}
                                            </Typography>
                                            <Chip 
                                                label={`${items.length} عملیات`} 
                                                size="small" 
                                                variant="outlined" 
                                                color="primary" 
                                            />
                                        </div>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Restore />}
                                            onClick={() => handleRevert(bundle)}
                                            disabled={revertLoading[bundle]}
                                            size="small"
                                            sx={{ borderRadius: 2 }}
                                        >
                                            {revertLoading[bundle] ? 'در حال بازگشت...' : 'بازگشت به این مرحله'}
                                        </Button>
                                    </div>
                                    
                                    {/* Timeline items */}
                                    <div className=" space-y-4">
                                        {items.map((item, itemIndex) => (
                                            <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <Chip 
                                                            label={item.nodeCommand} 
                                                            size="small" 
                                                            sx={{ 
                                                                backgroundColor: getCommandColor(item.nodeCommand),
                                                                color: 'white',
                                                                fontWeight: 'bold'
                                                            }}
                                                        />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {formatDate(item.createdAt)}
                                                        </Typography>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-2 my-3">
                                                    <div className="flex-1 text-right">
                                                        <Typography variant="body2" color="text.secondary">
                                                            از:
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="medium" className="text-green-700">
                                                            {item.from}
                                                        </Typography>
                                                    </div>
                                                    <ArrowBack color="action" fontSize="small" />
                                                    <div className="flex-1 text-right">
                                                        <Typography variant="body2" color="text.secondary">
                                                            به:
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="medium" className="text-blue-600">
                                                            {item.to}
                                                        </Typography>
                                                    </div>
                                                </div>
                                                
                                                {item.description && (
                                                    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            توضیحات: {item.description}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {bundleIndex < Object.keys(groupedData).length - 1 && (
                                        <Divider sx={{ mt: 4, mb: 2 }} />
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <History sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                هیچ تاریخچه‌ای یافت نشد
                            </Typography>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}