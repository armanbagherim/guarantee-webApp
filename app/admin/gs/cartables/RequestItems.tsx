import { fetcher } from '@/app/components/admin-components/fetcher';
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, Skeleton, Chip, Avatar, IconButton, Box, Typography, Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import QrCodeIcon from '@mui/icons-material/QrCode';
import PersonIcon from '@mui/icons-material/Person';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryIcon from '@mui/icons-material/Category';
import EmptyStateIllustration from './empty-state-illustration'; // You would need to create this component

export default function RequestItems({ historyOpen, setHistoryOpen }) {
    const [loading, setLoading] = useState(true);
    const [requestItems, setRequestItems] = useState([]);
    
    useEffect(() => {
        if (historyOpen.isOpen) {
            setLoading(false);
            setRequestItems(historyOpen.request?.guaranteeRequest?.requestItems || []);
        }
    }, [historyOpen.isOpen, historyOpen.request]);

    const handleClose = () => {
        setHistoryOpen((prev) => ({ ...prev, isOpen: false }));
        setLoading(true);
        setRequestItems([]);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('fa-IR'),
            time: date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
        };
    };

    return (
        <Dialog
            open={historyOpen.isOpen}
            onClose={handleClose}
            aria-labelledby="request-items-dialog-title"
            maxWidth="md"
            fullWidth
            PaperProps={{
                style: {
                    direction: 'rtl',
                    borderRadius: '16px',
                    overflow: 'hidden',
                },
            }}
        >
            <DialogTitle 
                className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b"
                id="request-items-dialog-title"
            >
                <div className="flex items-center">
                    <Avatar className="ml-3 bg-blue-600">
                        <Inventory2Icon />
                    </Avatar>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            اقلام همراه با دستگاه
                        </h2>
                        <p className="text-sm text-gray-600">
                            درخواست #{historyOpen.requestId}
                        </p>
                    </div>
                </div>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                        bgcolor: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent className="p-0" sx={{ maxHeight: '500px', overflowY: 'auto' }}>
                {loading ? (
                    <div className="p-5 space-y-4">
                        {[1, 2, 3].map((_, index) => (
                            <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                <div className="flex items-start">
                                    <Skeleton variant="circular" width={40} height={40} className="ml-3" />
                                    <div className="flex-1">
                                        <Skeleton variant="text" width="60%" height={24} />
                                        <Skeleton variant="text" width="40%" height={16} className="mt-1" />
                                        <div className="mt-3 flex space-x-2 space-x-reverse">
                                            <Skeleton variant="rectangular" width={80} height={24} rx={12} />
                                            <Skeleton variant="rectangular" width={60} height={24} rx={12} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : requestItems.length > 0 ? (
                    <div className="p-5 space-y-4">
                        {requestItems.map((item, index) => {
                            const createdDate = formatDate(item.createdAt);
                            const updatedDate = item.updatedAt && item.updatedAt !== item.createdAt 
                                ? formatDate(item.updatedAt) 
                                : null;
                            
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden"
                                >
                                    <div className="p-4">
                                        <div className="flex items-start">
                                            <Avatar className="ml-3 bg-indigo-100 text-indigo-600">
                                                <Inventory2Icon />
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                                                        {item.barcode && (
                                                            <div className="flex items-center mt-1 text-sm text-gray-600">
                                                                <QrCodeIcon className="ml-1" fontSize="small" />
                                                                بارکد: {item.barcode}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {item.isDeleted && (
                                                        <Chip 
                                                            icon={<DeleteIcon fontSize="small" />}
                                                            label="حذف شده" 
                                                            color="error" 
                                                            size="small" 
                                                            variant="outlined"
                                                        />
                                                    )}
                                                </div>
                                                
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    <Chip 
                                                        icon={<CategoryIcon fontSize="small" />}
                                                        label={item.requestItemType?.title || 'نامشخص'} 
                                                        variant="outlined" 
                                                        size="small"
                                                        color="primary"
                                                    />
                                                    <Chip 
                                                        icon={<PersonIcon fontSize="small" />}
                                                        label={`${item.user?.firstname || ''} ${item.user?.lastname || ''}`} 
                                                        variant="outlined" 
                                                        size="small"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <Divider className="my-3" />
                                        
                                        <div className="flex items-center text-xs text-gray-500">
                                            <ScheduleIcon className="ml-1" fontSize="small" />
                                            <span>ثبت‌شده در {createdDate.date} ساعت {createdDate.time}</span>
                                            {updatedDate && (
                                                <div className="flex items-center mr-3">
                                                    <EditIcon className="ml-1" fontSize="small" />
                                                    <span>ویرایش در {updatedDate.date} ساعت {updatedDate.time}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-8 flex flex-col items-center justify-center bg-gray-50">
                        <div className="w-32 h-32 mb-4 text-gray-300">
                            {/* Replace with your empty state illustration */}
                            <Inventory2Icon sx={{ fontSize: 80 }} />
                        </div>
                        <Typography variant="h6" className="text-gray-700 mb-2">
                            هیچ قلمی ثبت نشده است
                        </Typography>
                        <Typography variant="body2" className="text-gray-500 text-center max-w-sm">
                            برای این درخواست هیچ قلمی ثبت نشده است. در صورت نیاز، می‌توانید اقلام را به درخواست اضافه کنید.
                        </Typography>
                    </div>
                )}
            </DialogContent>

            <DialogActions className="p-4 bg-gray-50 border-t">
                <Button
                    onClick={handleClose}
                    variant="contained"
                    startIcon={<CloseIcon />}
                    className="text-sm font-semibold"
                    sx={{ borderRadius: '8px' }}
                >
                    بستن
                </Button>
            </DialogActions>
        </Dialog>
    );
}