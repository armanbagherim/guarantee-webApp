import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Typography, div, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider } from "@mui/material";
import toast from "react-hot-toast";
import { fetcher } from "@/app/components/admin-components/fetcher";

const PreFactorInLocation = ({ currentOperation, nodeCommands, setAction, setTriggered, triggered, session, ...node }) => {
    const [description, setDescription] = useState("");
    const [factor, setFactor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentType, setPaymentType] = useState('cash')
    const formatPrice = (price) => {
        return new Intl.NumberFormat('fa-IR').format(price) + " ریال";
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

    const handleButtonClick = async (command) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${command.route}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${session.token}`
                },
                body: JSON.stringify({
                    requestStateId: +currentOperation.id,
                    requestId: +currentOperation.requestId,
                    nodeCommandId: +command.id,
                    nodeId: +node.id,
                    description,
                    isOnline: paymentType === 'cash' ? false : true
                }),
            });

            if (!response.ok) {
                throw new Error("خطا در ارتباط با سرور");
            }

            const result = await response.json();
            setTriggered(!triggered);
            setAction((prev) => ({ ...prev, isOpen: false }));
            toast.success(result.result.message);
        } catch (error) {
            toast.error(error.message);
            console.error("Error:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-sm">
                <CircularProgress color="primary" />
                <Typography variant="body1" className="mt-4 text-gray-600">در حال دریافت اطلاعات فاکتور...</Typography>
            </div>
        );
    }

    if (!factor) {
        return (
            <div className="flex items-center justify-center h-64 bg-red-50 rounded-sm">
                <Typography variant="body1" color="error">خطا در دریافت اطلاعات فاکتور</Typography>
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-4 p-4">
            {/* هدر فاکتور */}
            <div className="p-2 pb-0 rounded-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <Typography variant="h6" className="font-bold !text-sm text-gray-800">پیش‌فاکتور خدمات گارانتی</Typography>
                        <Typography variant="subtitle2" className="text-gray-500">شماره فاکتور: {factor.factor.id}</Typography>
                    </div>
                    <div className="text-left">
                        <Typography variant="body2">تاریخ انقضا: {new Date(factor.factor.expireDate).toLocaleDateString('fa-IR')}</Typography>
                        <Typography variant="body2">وضعیت: {factor.factor.factorStatusId === 1 ? "در انتظار پرداخت" : "تکمیل شده"}</Typography>
                    </div>
                </div>
            </div>

            {/* {factor.isOnlinePayment ? (
                <div className="bg-blue-50 border-r-4 border-blue-500 p-4 my-4 rounded-lg flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <p className="text-blue-800 font-medium">روش پرداخت: آنلاین</p>
                        <p className="text-blue-600 text-sm mt-1">پس از تایید شما لطفا منتظر پرداخت توسط مشتری از طریق پنل مشتری باشید</p>
                    </div>
                </div>
            ) : (
                <div className="bg-amber-50 border-r-4 border-amber-500 p-4 my-4 rounded-lg flex items-start">
                    <svg className="w-5 h-5 text-amber-600 mt-0.5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                        <p className="text-amber-800 font-medium">روش پرداخت: حضوری</p>
                        <p className="text-amber-600 text-sm mt-1">لطفاً مبلغ فاکتور را به صورت نقدی از مشتری محترم دریافت نمایید.</p>
                    </div>
                </div>
            )} */}
            {/* خلاصه فاکتور */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-xl">
                    <Typography variant="subtitle1" className="text-blue-600">مبلغ کل فاکتور</Typography>
                    <Typography variant="h6" className="mt-2 font-bold">{formatPrice(factor.factor.totalPrice)}</Typography>
                </div>
                <div className={`p-4 rounded-xl ${factor.remainingAmount < 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                    <Typography variant="subtitle1" className={factor.remainingAmount < 0 ? 'text-red-600' : 'text-green-600'}>
                        {factor.remainingAmount < 0 ? 'مبلغ بدهی' : 'مبلغ باقیمانده'}
                    </Typography>
                    <Typography variant="h6" className={`mt-2 font-bold ${factor.remainingAmount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatPrice(Math.abs(factor.remainingAmount))}
                    </Typography>
                </div>
            </div>


            {/* تراکنش‌ها */}
            {factor.transactions && factor.transactions.length > 0 && (
                <div elevation={1} className="p-2 rounded-sm">
                    <Typography variant="h6" className="mb-4 font-bold text-gray-700 !text-sm border-b pb-2">تراکنش‌های پرداخت</Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow className="bg-gray-100">
                                    <TableCell className="font-bold">شناسه تراکنش</TableCell>
                                    <TableCell className="font-bold">درگاه پرداخت</TableCell>
                                    <TableCell className="font-bold">مبلغ</TableCell>
                                    <TableCell className="font-bold">تاریخ تراکنش</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {factor.transactions.map((tx) => (
                                    <TableRow key={tx.transactionId}>
                                        <TableCell>{tx.transactionId}</TableCell>
                                        <TableCell>{tx.paymentGatewayTitle}</TableCell>
                                        <TableCell>{formatPrice(tx.price)}</TableCell>
                                        <TableCell>{new Date(tx.transactionDate).toLocaleString('fa-IR')}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            )}

            {/* خدمات */}
            <div elevation={1} className="p-2 rounded-sm">

                {/* خدمات قطعات */}
                {factor.partServices && factor.partServices.length > 0 && (
                    <>
                        <Typography variant="subtitle1" className="pt-1 pb-2 text-gray-600">قطعات</Typography>
                        <TableContainer className="mt-2">
                            <Table>
                                <TableHead>
                                    <TableRow className="bg-gray-100">
                                        <TableCell className="font-bold">نام قطعه</TableCell>
                                        <TableCell className="font-bold">نوع خدمات</TableCell>
                                        <TableCell className="font-bold">تعداد</TableCell>
                                        <TableCell className="font-bold">قیمت واحد</TableCell>
                                        <TableCell className="font-bold">قیمت کل</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {factor.partServices.map((service) => (
                                        <TableRow key={service.id}>
                                            <TableCell>{service.title}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${service.warrantyServiceTypeId === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {service.warrantyServiceTypeTitle}
                                                </span>
                                            </TableCell>
                                            <TableCell>{service.qty}</TableCell>
                                            <TableCell>{formatPrice(service.totalPrice / service.qty)}</TableCell>
                                            <TableCell>{formatPrice(service.totalPrice)}</TableCell>
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
                        <Typography variant="subtitle1" className="pt-4 pb-2 text-gray-600">خدمات</Typography>
                        <TableContainer className="mt-2">
                            <Table>
                                <TableHead>
                                    <TableRow className="bg-gray-100">
                                        <TableCell className="font-bold">عنوان خدمت</TableCell>
                                        <TableCell className="font-bold">نوع خدمات</TableCell>
                                        <TableCell className="font-bold">تعداد</TableCell>
                                        <TableCell className="font-bold">قیمت کل</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {factor.solutionServices.map((service) => (
                                        <TableRow key={service.id}>
                                            <TableCell>{service.title || 'بدون عنوان'}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${service.warrantyServiceTypeId === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {service.warrantyServiceTypeTitle}
                                                </span>
                                            </TableCell>
                                            <TableCell>{service.qty}</TableCell>
                                            <TableCell>{formatPrice(service.totalPrice)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
            </div>
            <div className="mb-2 mt-2">{factor.isAvailableForOnlinePayment ? "مشتری چطور پرداخت کند؟" : "مشتری وجه را به صورت نقد پرداخت می کند."} </div>

            {factor.isAvailableForOnlinePayment ?
                <div className="flex gap-2">
                    <span className={`px-3 py-2 rounded-xl border border-1 ${paymentType == 'cash' ? 'border-primary' : 'border-gray-400'}`} onClick={() => setPaymentType('cash')}>پرداخت نقدی</span>
                    <span className={`px-3 py-2 rounded-xl border border-1 ${paymentType == 'online' ? 'border-primary' : 'border-gray-400'}`} onClick={() => setPaymentType('online')}>پرداخت آنلاین</span>
                </div>
                : null}
            {/* توضیحات و اقدامات */}
            <div className="space-y-4">
                <div elevation={1} className="p-2 rounded-sm">
                    <Typography variant="h6" className="mb-4 font-bold text-gray-700 !text-sm border-b pb-2">توضیحات</Typography>
                    <textarea
                        rows={4}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full border border-gray-300 focus:border-blue-500 outline-none rounded-xl p-4 text-right"
                        placeholder="توضیحات خود را وارد نمایید..."
                        style={{ direction: 'rtl' }}
                    />
                </div>

                <div className="flex flex-wrap gap-3 justify-end">
                    {nodeCommands?.map((command) => (
                        <Button
                            key={command.id}
                            variant="contained"
                            style={{
                                backgroundColor: command.nodeCommandType.commandColor,
                                minWidth: '120px'
                            }}
                            onClick={() => handleButtonClick(command)}
                            className="shadow-md"
                        >
                            {command.name}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PreFactorInLocation;