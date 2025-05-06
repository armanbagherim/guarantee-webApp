"use client";
import Link from "next/link";
import React from "react";

export default function FactorDetail({ factor }) {
  // Format price with commas
  const formatPrice = (price) => {
    return new Intl.NumberFormat("fa-IR").format(Number(price)) + " ریال";
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fa-IR");
  };

  // Get status text
  const getStatusText = (statusId) => {
    const statusMap = {
      1: "در انتظار پرداخت",
      2: "در حال پردازش",
      3: "پرداخت شده",
      4: "لغو شده",
    };
    return statusMap[statusId] || "نامشخص";
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <html dir="rtl" lang="fa">
      <head>
        <style>{`
          @page {
            size: A5;
            margin: 10mm;
          }
          @media print {
            .no-print {
              display: none !important;
            }
            body {
              font-size: 10px;
              line-height: 1.2;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 138mm;
              max-height: 190mm;
              overflow: hidden;
              padding: 5mm;
            }
            table {
              font-size: 9px;
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              padding: 3px 5px;
              border: 1px solid #e5e7eb;
            }
            h3 {
              font-size: 12px;
              margin-bottom: 4px;
            }
            .print-footer {
              position: absolute;
              bottom: 5mm;
              width: 100%;
              text-align: center;
              font-size: 8px;
            }
          }
          @media screen {
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 10px;
            }
            .print-footer {
              display: none;
            }
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          {/* Header */}
          <div className="mb-4 print-header">
            <div className="flex justify-between items-center mb-2 no-print">
              <h1 className="text-lg font-bold">فاکتور #{factor.id}</h1>
              <div className="flex gap-2">
                <Link
                  href="/factors"
                  className="px-3 py-1 border rounded-md text-xs hover:bg-gray-100"
                >
                  بازگشت
                </Link>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700"
                >
                  پرینت
                </button>
              </div>
            </div>
            <div className="border p-3 rounded-md">
              <h3 className="font-bold">شرکت آریا کیش مهرداد</h3>
              <div className="text-xs grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-600">شناسه ملی: </span>10104086506
                </div>
                <div>
                  <span className="text-gray-600">کد اقتصادی: </span>10104086506
                </div>
                <div>
                  <span className="text-gray-600">شماره ثبت: </span>361551
                </div>
                <div>
                  <span className="text-gray-600">کد پستی: </span>1415995673
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">آدرس: </span>تهران، بلوار
                  کشاورز، خیابان کبکانیان، پلاک 14، طبقه اول، واحد دو
                </div>
              </div>
            </div>
          </div>

          {/* Factor Details */}
          <div className="border p-3 rounded-md mb-4">
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div>
                <span className="text-gray-600">شماره فاکتور: </span>#
                {factor.id}
              </div>
              <div>
                <span className="text-gray-600">تاریخ ایجاد: </span>
                {formatDate(factor.createdAt)}
              </div>
              <div>
                <span className="text-gray-600">تاریخ پرداخت: </span>
                {formatDate(factor.settlementDate)}
              </div>
              <div>
                <span className="text-gray-600">وضعیت: </span>
                <span
                  className={`font-medium ${
                    factor.factorStatusId === 3
                      ? "text-green-600"
                      : factor.factorStatusId === 4
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}
                >
                  {getStatusText(factor.factorStatusId)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">نام مشتری: </span>
                {factor.fullName}
              </div>
              <div>
                <span className="text-gray-600">کد ملی: </span>
                {factor.nationalCode ?? "ثبت نشده"}
              </div>
              <div>
                <span className="text-gray-600">شماره درخواست: </span>#
                {factor.requestId}
              </div>
              <div>
                <span className="text-gray-600">مبلغ کل: </span>
                {formatPrice(factor.totalPrice)}
              </div>
            </div>

            {/* Factor Items */}
            <h3 className="font-bold border-b pb-1 mb-2">آیتم‌های فاکتور</h3>
            <table>
              <thead className="bg-gray-50">
                <tr>
                  <th>ردیف</th>
                  <th>عنوان</th>
                  <th>تعداد</th>
                  <th>مبلغ واحد</th>
                  <th>مبلغ کل</th>
                </tr>
              </thead>
              <tbody>
                {factor.factorItems.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.title}</td>
                    <td>{item.qty}</td>
                    <td>
                      {formatPrice((Number(item.price) / item.qty).toString())}
                    </td>
                    <td>{formatPrice(Number(item.price).toString())}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Transactions */}
            {factor.transactions && factor.transactions.length > 0 && (
              <div className="mt-3">
                <h3 className="font-bold border-b pb-1 mb-2">تراکنش‌ها</h3>
                <table>
                  <thead className="bg-gray-50">
                    <tr>
                      <th>ردیف</th>
                      <th>درگاه پرداخت</th>
                      <th>مبلغ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {factor.transactions.map((transaction, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{transaction.gatewayTitle}</td>
                        <td>{formatPrice(transaction.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Print Footer */}
          <div className="print-footer">
            <p>مهر و امضای شرکت آریا کیش مهرداد</p>
            <p>تهران، بلوار کشاورز، خیابان کبکانیان، پلاک 14 | تلفن: 1882</p>
          </div>
        </div>
      </body>
    </html>
  );
}
