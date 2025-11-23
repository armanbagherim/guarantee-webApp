import React, { useEffect, useState } from "react";
import {
    Button,
    CircularProgress,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import toast from "@/app/components/toast";
import { fetcher } from "@/app/components/admin-components/fetcher";

const PreFactorInLocation = ({
    currentOperation,
    nodeCommands,
    setAction,
    setTriggered,
    triggered,
    session,
    ...node
}: any) => {
    const [description, setDescription] = useState("");
    const [factor, setFactor] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [paymentType, setPaymentType] = useState<"cash" | "online">("cash");

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("fa-IR").format(price) + " ریال";
    };

    const fetchFactor = async () => {
        try {
            setLoading(true);
            const res = await fetcher({
                method: "GET",
                url: `/v1/api/guarantee/cartable/factorDetailAndRemainingAmount/request/${currentOperation.requestId}`,
            });
            setFactor(res.result);
        } catch (error) {
            console.error("خطا در دریافت اطلاعات فاکتور:", error);
            toast.error("خطا در بارگذاری اطلاعات فاکتور");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFactor();
    }, []);

    // تنظیم هوشمند نوع پرداخت بعد از لود فاکتور
    useEffect(() => {
        if (factor) {
            setPaymentType(factor.isAvailableForOnlinePayment ? "online" : "cash");
        }
    }, [factor]);

    const handleButtonClick = async (command: any) => {
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
                    description,
                    isOnline: paymentType === "online",
                }),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || "خطا در ارتباط با سرور");
            }

            const result = await response.json();
            setTriggered(!triggered);
            setAction((prev: any) => ({ ...prev, isOpen: false }));
            toast.success(result.result?.message || "عملیات با موفقیت انجام شد");
        } catch (error: any) {
            toast.error(error.message || "خطایی رخ داد");
            console.error("Error:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
                <CircularProgress color="primary" />
                <Typography className="mt-4 text-gray-600">در حال دریافت اطلاعات فاکتور...</Typography>
            </div>
        );
    }

    if (!factor) {
        return (
            <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
                <Typography color="error">خطا در دریافت اطلاعات فاکتور</Typography>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8">
            {/* هدر فاکتور */}
            <div className="border-b pb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <Typography variant="h6" className="font-bold text-gray-800">
                            پیش‌فاکتور خدمات گارانتی (در محل)
                        </Typography>
                        <Typography variant="body2" className="text-gray-500 mt-1">
                            شماره فاکتور: {factor.factor.id}
                        </Typography>
                    </div>
                    <div className="text-left">
                        <Typography variant="body2" className="text-gray-600">
                            تاریخ انقضا: {new Date(factor.factor.expireDate).toLocaleDateString("fa-IR")}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                            وضعیت: {factor.factor.factorStatusId === 1 ? "در انتظار پرداخت" : "تکمیل شده"}
                        </Typography>
                    </div>
                </div>
            </div>

            {/* خلاصه مالی */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-2xl text-center shadow-sm">
                    <Typography variant="subtitle1" className="text-blue-700 font-medium">
                        مبلغ کل فاکتور
                    </Typography>
                    <Typography variant="h5" className="mt-3 font-bold text-blue-900">
                        {formatPrice(factor.factor.totalPrice)}
                    </Typography>
                </div>

                <div className={`p-6 rounded-2xl text-center shadow-sm ${factor.remainingAmount < 0 ? "bg-red-50" : "bg-green-50"}`}>
                    <Typography variant="subtitle1" className={`font-medium ${factor.remainingAmount < factor.remainingAmount < 0 ? "text-red-700" : "text-green-700"}`}>
                        {factor.remainingAmount < 0 ? "مبلغ بدهی" : "مبلغ باقیمانده"}
                    </Typography>
                    <Typography variant="h5" className={`mt-3 font-bold ${factor.remainingAmount < 0 ? "text-red-900" : "text-green-900"}`}>
                        {formatPrice(Math.abs(factor.remainingAmount))}
                    </Typography>
                </div>
            </div>

            {/* تراکنش‌های پرداخت */}
            {factor.transactions && factor.transactions.length > 0 && (
                <div className="border rounded-xl overflow-hidden shadow-sm">
                    <Typography variant="h6" className="p-4 bg-gray-50 font-bold border-b">
                        تراکنش‌های پرداخت
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow className="bg-gray-100">
                                    <TableCell className="font-bold">شناسه تراکنش</TableCell>
                                    <TableCell className="font-bold">درگاه پرداخت</TableCell>
                                    <TableCell className="font-bold">مبلغ</TableCell>
                                    <TableCell className="font-bold">تاریخ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {factor.transactions.map((tx: any) => (
                                    <TableRow key={tx.transactionId}>
                                        <TableCell>{tx.transactionId}</TableCell>
                                        <TableCell>{tx.paymentGatewayTitle}</TableCell>
                                        <TableCell>{formatPrice(tx.price)}</TableCell>
                                        <TableCell>{new Date(tx.transactionDate).toLocaleString("fa-IR")}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            )}

            {/* قطعات */}
            {factor.partServices && factor.partServices.length > 0 && (
                <>
                    <Typography variant="h6" className="font-bold text-gray-800">قطعات</Typography>
                    <TableContainer className="border rounded-xl shadow-sm">
                        <Table>
                            <TableHead>
                                <TableRow className="bg-gray-50">
                                    <TableCell className="font-bold">نام قطعه</TableCell>
                                    <TableCell className="font-bold">نوع خدمت</TableCell>
                                    <TableCell className="font-bold">تعداد</TableCell>
                                    <TableCell className="font-bold">قیمت واحد</TableCell>
                                    <TableCell className="font-bold">قیمت کل</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {factor.partServices.map((item: any) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.title}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${item.warrantyServiceTypeId === 1
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {item.warrantyServiceTypeTitle}
                                            </span>
                                        </TableCell>
                                        <TableCell>{item.qty}</TableCell>
                                        <TableCell>{formatPrice(item.totalPrice / item.qty)}</TableCell>
                                        <TableCell>{formatPrice(item.totalPrice)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}

            {/* خدمات راه‌حل */}
            {factor.solutionServices && factor.solutionServices.length > 0 && (
                <>
                    <Typography variant="h6" className="font-bold text-gray-800 mt-8">خدمات</Typography>
                    <TableContainer className="border rounded-xl shadow-sm">
                        <Table>
                            <TableHead>
                                <TableRow className="bg-gray-50">
                                    <TableCell className="font-bold">عنوان خدمت</TableCell>
                                    <TableCell className="font-bold">نوع خدمت</TableCell>
                                    <TableCell className="font-bold">تعداد</TableCell>
                                    <TableCell className="font-bold">قیمت کل</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {factor.solutionServices.map((item: any) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.title || "بدون عنوان"}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${item.warrantyServiceTypeId === 1
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {item.warrantyServiceTypeTitle}
                                            </span>
                                        </TableCell>
                                        <TableCell>{item.qty}</TableCell>
                                        <TableCell>{formatPrice(item.totalPrice)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}

            {/* انتخاب روش پرداخت — هوشمند */}
            <div className="border-t pt-8">
                <Typography variant="body1" className="mb-6 text-lg font-medium text-gray-700">
                    {factor.isAvailableForOnlinePayment
                        ? "مشتری چگونه پرداخت کند؟"
                        : "پرداخت فقط به صورت نقدی در محل انجام می‌شود"}
                </Typography>

                {factor.isAvailableForOnlinePayment && (
                    <div className="flex gap-6 flex-wrap">
                        <button
                            type="button"
                            onClick={() => setPaymentType("cash")}
                            className={`px-8 py-4 rounded-xl border-2 font-medium transition-all duration-200 ${paymentType === "cash"
                                    ? "border-primary bg-primary/10 text-primary shadow-lg"
                                    : "border-gray-300 text-gray-600 hover:border-gray-400"
                                }`}
                        >
                            پرداخت نقدی در محل
                        </button>
                        <button
                            type="button"
                            onClick={() => setPaymentType("online")}
                            className={`px-8 py-4 rounded-xl border-2 font-medium transition-all duration-200 ${paymentType === "online"
                                    ? "border-primary bg-primary/10 text-primary shadow-lg"
                                    : "border-gray-300 text-gray-600 hover:border-gray-400"
                                }`}
                        >
                            پرداخت آنلاین توسط مشتری
                        </button>
                    </div>
                )}
            </div>

            {/* توضیحات */}
            <div className="mt-8">
                <Typography variant="subtitle1" className="mb-3 font-bold text-gray-800">
                    توضیحات (اختیاری)
                </Typography>
                <textarea
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                    placeholder="توضیحات خود را اینجا بنویسید..."
                    style={{ direction: "rtl", resize: "vertical" }}
                />
            </div>

            {/* دکمه‌های اقدام */}
            <div className="flex justify-end gap-4 flex-wrap pt-6 border-t">
                {nodeCommands?.map((command: any) => (
                    <Button
                        key={command.id}
                        variant="contained"
                        onClick={() => handleButtonClick(command)}
                        style={{
                            backgroundColor: command.nodeCommandType.commandColor || "#1976d2",
                            minWidth: "140px",
                            padding: "12px 24px",
                            fontSize: "1rem",
                        }}
                        className="shadow-lg hover:shadow-xl transition"
                    >
                        {command.name}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default PreFactorInLocation;