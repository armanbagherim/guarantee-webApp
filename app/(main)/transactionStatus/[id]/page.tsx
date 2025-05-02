import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaClock, FaExclamationCircle, FaArrowRight } from 'react-icons/fa';

async function getTransaction(session, id) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/client/transactions/${id}`,
        {
            cache: "no-store",
            headers: {
                Authorization: `Bearer ${session.token}`,
            },
        }
    );
    if (res.status === 404) {
        return notFound();
    }
    const data = await res.json();
    return data.result
}

const statusConfig = {
    1: {
        text: 'منتظر پرداخت',
        color: 'bg-amber-100 text-amber-800',
        icon: <FaClock className="text-amber-500" />
    },
    2: {
        text: 'لغو شده',
        color: 'bg-red-100 text-red-800',
        icon: <FaTimesCircle className="text-red-500" />
    },
    3: {
        text: 'پرداخت نشده',
        color: 'bg-rose-100 text-rose-800',
        icon: <FaExclamationCircle className="text-rose-500" />
    },
    4: {
        text: 'پرداخت شده',
        color: 'bg-green-100 text-green-800',
        icon: <FaCheckCircle className="text-green-500" />
    },
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR').format(parseInt(price)) + ' تومان';
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};

export default async function PaymentStatus({ params }) {
    const session = await getServerSession(authOptions);
    const transaction = await getTransaction(session, params.id);
    console.log(transaction)
    if (!transaction) {
        return notFound();
    }

    const status = statusConfig[transaction.transactionStatusId];

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                {/* Back link to factors */}
                <Link
                    href="/factors"
                    className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
                    dir="rtl"
                >
                    <FaArrowRight className="ml-2" />
                    بازگشت به لیست فاکتورها
                </Link>

                {/* Payment status card */}
                <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
                    <div className="p-8">
                        <div className="flex justify-between items-start" dir="rtl">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    وضعیت پرداخت
                                </h1>
                                <p className="text-gray-500 mt-2">
                                    کد پیگیری: {transaction.id}
                                </p>
                            </div>
                            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${status?.color}`}>
                                {status?.icon}
                                <span className="mr-2">{status?.text}</span>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4" dir="rtl">
                            <div className="flex justify-between">
                                <span className="text-gray-600">مبلغ تراکنش:</span>
                                <span className="font-bold">{formatPrice(transaction?.totalPrice)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">شماره فاکتور:</span>
                                <span className="font-medium">{transaction?.factorId}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">تاریخ ایجاد:</span>
                                <span>{formatDate(transaction?.createdAt)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">آخرین بروزرسانی:</span>
                                <span>{formatDate(transaction?.updatedAt)}</span>
                            </div>
                        </div>

                        {/* Status message based on payment state */}

                        {/* Actions based on status */}

                    </div>
                </div>

                {/* Help section */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>در صورت وجود مشکل با پشتیبانی تماس بگیرید</p>
                    <p className="font-medium mt-1">021-86780 - 021-1882</p>
                </div>
            </div>
        </div>
    );
}