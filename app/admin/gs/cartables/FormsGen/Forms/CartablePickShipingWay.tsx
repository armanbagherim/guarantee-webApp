import React, { useEffect, useState, startTransition } from "react";
import {
    Button,
    TextField,
    Box,
    CircularProgress,
    Backdrop,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";
import toast from "@/app/components/toast";
import { fetcher } from "@/app/components/admin-components/fetcher";
import Image from "next/image";
import 'dayjs/locale/fa';
import dayjs from "dayjs";
import { useRouter } from 'next/navigation';
import concat from "@/app/components/utils/AddressConcat";
import BusinessIcon from '@mui/icons-material/Business';

const CartablePickShipingWay = ({ currentOperation, nodeCommands, setAction, setTriggered, triggered, session, ...node }) => {
    const [shippingWays, setShippingWays] = useState([]);
    const [organizationAddress, setOrganizationAddress] = useState();
    const [selectedShippingWay, setSelectedShippingWay] = useState(null);
    const [description, setDescription] = useState("");
    const [activeTab, setActiveTab] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // New loading state for initial data
    const [items, setItems] = useState([]);
    const [itemModalOpen, setItemModalOpen] = useState(false);
    const [newItemTitle, setNewItemTitle] = useState("");
    const [newItemBarcode, setNewItemBarcode] = useState("");
    const router = useRouter();

    const fetchShipmentWays = async () => {
        try {
            const res = await fetcher({
                method: "GET",
                url: `/v1/api/guarantee/cartable/shippingWays/request/${currentOperation.requestId}`,
            });
            setShippingWays(res.result);
            if (res.result.length > 0) {
                setSelectedShippingWay(res.result[0].id);
            }
        } catch (error) {
            console.error("Error fetching shipping ways:", error);
            toast.error("خطا در دریافت روش‌های ارسال");
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                await Promise.all([
                    fetchShipmentWays()
                ]);
            } catch (error) {
                console.error("Error in initial data loading:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [currentOperation.requestId]);

    const handleTabChange = (index) => {
        setActiveTab(index);
        setSelectedShippingWay(shippingWays[index]?.id || null);
    };

    const handleAddItem = () => {
        if (!newItemTitle.trim()) {
            toast.error("لطفا عنوان را وارد کنید.");
            return;
        }
        const newItem = {
            title: newItemTitle.trim(),
            barcode: newItemBarcode.trim() || null,
        };
        setItems([...items, newItem]);
        setNewItemTitle("");
        setNewItemBarcode("");
        setItemModalOpen(false);
        toast.success("اقلام با موفقیت اضافه شد.");
    };

    const handleRemoveItem = (index) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
    };

    const handleButtonClick = async (command) => {
        if (!selectedShippingWay) {
            toast.error("لطفا روش ارسال را انتخاب کنید");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${command.route}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${session.token}`,
                },
                body: JSON.stringify({
                    requestStateId: +currentOperation.id,
                    requestId: +currentOperation.requestId,
                    nodeCommandId: +command.id,
                    nodeId: +node.id,
                    cartableShipmentWayTrackingCode: description,
                    cartableShipmentWayId: +selectedShippingWay,
                    items: items,
                }),
            });

            if (!response.ok) {
                let jsonRes = await response.json()
                let errorMessage = jsonRes.errors ? jsonRes.errors[0] : jsonRes.message;
                throw new Error(errorMessage);
            }

            const result = await response.json();

            startTransition(() => {
                setTriggered(!triggered);
                setAction((prev) => ({ ...prev, isOpen: false }));
                router.refresh();
            });

            toast.success(result.result.message);
        } catch (error) {
            toast.error(error.message);
            console.error("Error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '200px'
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div className="flex flex-col justify-between gap-4 p-4">
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1
                }}
                open={isSubmitting}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <CircularProgress color="inherit" />
                    <div>در حال پردازش درخواست...</div>
                </Box>
            </Backdrop>

            {/* New Section: اقلام همراه با دستگاه - با دیزاین مدرن و Tailwind */}
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-gray-800">اقلام همراه با دستگاه</span>
                    <button
                        onClick={() => setItemModalOpen(true)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-md transition-all duration-200 transform hover:scale-105"
                    >
                        + اضافه کردن اقلام
                    </button>
                </div>
                {items.length > 0 ? (
                    <div className="space-y-3">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex justify-between items-center hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="flex flex-col space-y-1 flex-1">
                                    <span className="text-sm font-semibold text-gray-900">{item.title}</span>
                                    {item.barcode && (
                                        <span className="text-xs text-gray-600">بارکد: {item.barcode}</span>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleRemoveItem(index)}
                                    className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-sm transition-all duration-200 transform hover:scale-110"
                                    title="حذف"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-sm text-gray-500 mb-2">هیچ اقلامی اضافه نشده است.</p>
                        <p className="text-xs text-gray-400">برای ثبت اقلام همراه، روی دکمه بالا کلیک کنید.</p>
                    </div>
                )}
            </div>

            {/* Custom Flex Tabs */}
            <div className="w-full flex overflow-x-auto gap-2 p-1 rounded-xl">
                {shippingWays.map((way, index) => (
                    <button
                        key={way.id}
                        onClick={() => handleTabChange(index)}
                        className={`flex-shrink-0 flex flex-row items-center p-2 rounded-lg transition-all ${activeTab === index
                            ? 'border-2 border-blue-600 bg-blue-50'
                            : 'border-2 border-transparent hover:border-gray-300'}`}
                        disabled={isSubmitting}
                    >
                        <div className="relative w-12 h-12">
                            <Image
                                src={`/${way.icon}`}
                                alt={way.title}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="text-xs pr-2">{way.title}</span>
                    </button>
                ))}
            </div>

            {/* Description Textarea */}
            <div className="w-full">
                <TextField
                    rows={6}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-200 focus:border-blue-700 outline-none rounded-2xl p-4"
                    placeholder="کد رهگیری یا شماره موبایل پیک"
                    disabled={isSubmitting}
                    multiline
                />
            </div>

            <div className="flex justify-between gap-2 mt-4">
                <Button
                    variant="contained"
                    className="!bg-gray-600"
                    onClick={() => setAction((prev) => ({ ...prev, isOpen: false }))}
                    disabled={isSubmitting}
                >
                    بستن
                </Button>
                {nodeCommands?.map((command) => (
                    <Button
                        key={command.id}
                        variant="contained"
                        style={{ backgroundColor: command.nodeCommandType.commandColor }}
                        onClick={() => handleButtonClick(command)}
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? (
                            <CircularProgress
                                size={20}
                                color="inherit"
                                sx={{ color: 'white' }}
                            />
                        ) : null}
                    >
                        {command.name}
                    </Button>
                ))}
            </div>

            {/* Modal for Adding Items */}
            <Dialog open={itemModalOpen} onClose={() => setItemModalOpen(false)}>
                <DialogTitle>اضافه کردن اقلام همراه با دستگاه</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="item-title"
                            label="عنوان اقلام"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={newItemTitle}
                            onChange={(e) => setNewItemTitle(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            id="item-barcode"
                            label="بارکد (اختیاری)"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={newItemBarcode}
                            onChange={(e) => setNewItemBarcode(e.target.value)}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setItemModalOpen(false)}>لغو</Button>
                    <Button onClick={handleAddItem}>اضافه کردن</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CartablePickShipingWay;