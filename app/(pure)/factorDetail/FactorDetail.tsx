'use client'
import Link from 'next/link'
import React from 'react'

export default function FactorDetail({ factor }) {
    // Format price with commas
    const formatPrice = (price: string) => {
        return new Intl.NumberFormat('fa-IR').format(Number(price)) + ' ریال';
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fa-IR');
    };

    // Get status text
    const getStatusText = (statusId: number) => {
        const statusMap: Record<number, string> = {
            1: 'در انتظار پرداخت',
            2: 'در حال پردازش',
            3: 'پرداخت شده',
            4: 'لغو شده'
        };
        return statusMap[statusId] || 'نامشخص';
    };

    const handlePrint = () => {
        if (typeof window !== 'undefined') {
            window.print();
        }
    };

    return (
        <html dir='rtl' lang='fa'>
            <body>
                <div className="max-w-6xl mx-auto p-4">
                    <div className="flex justify-between items-center mb-6 no-print">
                        <h1 className="text-2xl font-bold">جزئیات فاکتور #{factor.id}</h1>
                        <div className="flex gap-2">
                            <Link
                                href="/factors"
                                className="px-4 py-2 border rounded-md hover:bg-gray-100"
                            >
                                بازگشت به لیست
                            </Link>
                            <button
                                onClick={handlePrint}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                پرینت فاکتور
                            </button>
                        </div>
                    </div>

                    {/* Company Information Header */}
                    <div className="bg-white rounded-xl border p-6 mb-6 print-header">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <h3 className="font-bold text-lg border-b pb-2">اطلاعات شرکت</h3>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">نام شرکت:</span>
                                    <span className="font-medium">شرکت اریا کیش مهرداد</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">شناسه ملی:</span>
                                    <span className="font-medium">10104086506</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">شماره ثبت:</span>
                                    <span className="font-medium">361551</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-bold text-lg border-b pb-2">اطلاعات اقتصادی</h3>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">کد اقتصادی:</span>
                                    <span className="font-medium">10104086506</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">کد پستی:</span>
                                    <span className="font-medium">1415995673</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">تلفن:</span>
                                    <span className="font-medium">1882</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-bold text-lg border-b pb-2">آدرس شرکت</h3>
                                <div className="text-sm text-gray-700">
                                    تهران، بلوار کشاورز، خیابان کبکانیان، پلاک 14، طبقه اول، واحد دو
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Factor Details */}
                    <div className="bg-white rounded-xl border p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
                            <div className="space-y-2">
                                <h3 className="font-bold text-sm border-b pb-2">اطلاعات فاکتور</h3>
                                <div className="flex gap-4">
                                    <div className="flex justify-between gap-2 text-sm">
                                        <span className="text-gray-600">شماره فاکتور:</span>
                                        <span className="font-medium">#{factor.id}</span>
                                    </div>
                                    <div className="flex justify-between gap-2 text-sm">
                                        <span className="text-gray-600">تاریخ ایجاد:</span>
                                        <span className="font-medium">{formatDate(factor.createdAt)}</span>
                                    </div>
                                    <div className="flex justify-between gap-2 text-sm">
                                        <span className="text-gray-600">تاریخ پرداخت:</span>
                                        <span className="font-medium">{formatDate(factor.settlementDate)}</span>
                                    </div>

                                    <div className="flex justify-between gap-2 text-sm">
                                        <span className="text-gray-600">وضعیت:</span>
                                        <span className={`font-medium ${factor.factorStatusId === 3 ? 'text-green-600' :
                                            factor.factorStatusId === 4 ? 'text-red-600' : 'text-blue-600'
                                            }`}>
                                            {getStatusText(factor.factorStatusId)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-bold text-sm border-b pb-2">اطلاعات مشتری</h3>
                                <div className="flex gap-4">
                                    <div className="flex justify-between gap-2 text-sm">
                                        <span className="text-gray-600">نام کامل:</span>
                                        <span className="font-medium">{factor.fullName}</span>
                                    </div>
                                    <div className="flex justify-between gap-2 text-sm">
                                        <span className="text-gray-600">کد ملی:</span>
                                        <span className="font-medium">{factor.nationalCode ?? 'ثبت نشده'}</span>
                                    </div>
                                    <div className="flex justify-between gap-2 text-sm">
                                        <span className="text-gray-600">شماره درخواست:</span>
                                        <span className="font-medium">#{factor.requestId}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-bold text-sm border-b pb-2">اطلاعات مالی</h3>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">مبلغ کل:</span>
                                    <span className="font-medium">{formatPrice(factor.totalPrice)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="font-bold text-sm border-b pb-2 mb-4">آیتم‌های فاکتور</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ردیف</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عنوان</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تعداد</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مبلغ واحد</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مبلغ کل</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {factor.factorItems.map((item: any, index: number) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.title}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.qty}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPrice(item.price)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatPrice(Number(item.price).toString())}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {factor.transactions && factor.transactions.length > 0 && (
                            <div>
                                <h3 className="font-bold text-sm border-b pb-2 mb-4">تراکنش‌های پرداخت</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ردیف</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">درگاه پرداخت</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مبلغ پرداختی</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {factor.transactions.map((transaction: any, index: number) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.gatewayTitle}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPrice(transaction.price)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Print-only footer */}
                    <div className="hidden print:block text-center text-xs text-gray-500 mt-8">
                        <p>مهر و امضای شرکت</p>
                        <p className="mt-4">تهران، بلوار کشاورز، خیابان کبکانیان، پلاک 14، طبقه اول، واحد دو</p>
                        <p>تلفن: 1882</p>
                    </div>
                </div>
            </body>
        </html>
    )
}