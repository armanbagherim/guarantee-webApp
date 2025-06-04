import React, { useEffect, useState, startTransition } from "react";
import {
  Button,
  TextField,
  Box,
  CircularProgress,
  Backdrop,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import toast from "@/app/components/toast";
import { fetcher } from "@/app/components/admin-components/fetcher";
import Image from "next/image";
import "dayjs/locale/fa";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import concat from "@/app/components/utils/AddressConcat";
import BusinessIcon from "@mui/icons-material/Business";

const RequestFactorPay = ({
  currentOperation,
  nodeCommands,
  setAction,
  setTriggered,
  triggered,
  session,
  ...node
}) => {
  const [paymentGateways, setPaymentGateways] = useState([]);
  const [factor, setFactor] = useState();
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState(null);
  const [description, setDescription] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // New loading state for initial data
  const router = useRouter();

  const fetchPaymentGateways = async () => {
    try {
      const res = await fetcher({
        method: "GET",
        url: `/v1/api/guarantee/client/onlinePaymentGateways`,
      });
      setPaymentGateways(res.result);
      if (res.result.length > 0) {
        setSelectedPaymentGateway(res.result[0].id);
      }
    } catch (error) {
      console.error("Error fetching shipping ways:", error);
      toast.error("خطا در دریافت روش‌های ارسال");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFactor = async () => {
    try {
      const res = await fetcher({
        method: "GET",
        url: `/v1/api/guarantee/client/factorDetailAndRemainingAmount/request/${currentOperation.requestId}`,
      });
      setFactor(res.result);
    } catch (error) {
      console.error("Error fetching organization address:", error);
      toast.error("خطا در دریافت آدرس نماینده");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchFactor(), fetchPaymentGateways()]);
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
    setSelectedPaymentGateway(paymentGateways[index]?.id || null);
  };

  const handleButtonClick = async (command) => {
    if (!selectedPaymentGateway) {
      toast.error("لطفا روش ارسال را انتخاب کنید");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}${command.route}`,
        {
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
            paymentGatewayId: +selectedPaymentGateway,
          }),
        }
      );

      if (!response.ok) {
        let jsonRes = await response.json();
        let errorMessage = jsonRes.errors ? jsonRes.errors[0] : jsonRes.message;
        throw new Error(errorMessage);
      }

      const result = await response.json();

      startTransition(() => {
        router.push(result.result.paymentOptions.redirectUrl);
        setTriggered(!triggered);
        setAction((prev) => ({ ...prev, isOpen: false }));
      });

      toast.success(result.result.message);
    } catch (error) {
      toast.error(error.message);
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fa-IR").format(price) + " ریال";
  };

  if (isLoading) {
    console.log("loading baba");
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  console.log(factor);
  return (
    <div className="flex flex-col justify-between gap-4 p-4">
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={isSubmitting}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CircularProgress color="inherit" />
          <div>در حال پردازش درخواست...</div>
        </Box>
      </Backdrop>

      <div className="p-2 pb-0 rounded-sm">
        <div className="flex justify-between items-center">
          <div>
            <Typography
              variant="h6"
              className="font-bold !text-sm text-gray-800"
            >
              پیش‌فاکتور خدمات گارانتی
            </Typography>
            <Typography variant="subtitle2" className="text-gray-500">
              شماره فاکتور: {factor?.factor?.id}
            </Typography>
          </div>
          <div className="text-left">
            <Typography variant="body2">
              تاریخ انقضا:{" "}
              {new Date(factor?.factor?.expireDate).toLocaleDateString("fa-IR")}
            </Typography>
            <Typography variant="body2">
              وضعیت:{" "}
              {factor?.factor?.factorStatusId === 1
                ? "در انتظار پرداخت"
                : "تکمیل شده"}
            </Typography>
          </div>
        </div>
      </div>

      {/* خلاصه فاکتور */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-4 rounded-xl">
          <Typography variant="subtitle1" className="text-blue-600">
            مبلغ کل فاکتور
          </Typography>
          <Typography variant="h6" className="mt-2 font-bold">
            {formatPrice(factor?.factor?.totalPrice)}
          </Typography>
        </div>
        <div
          className={`p-4 rounded-xl ${factor?.remainingAmount < 0 ? "bg-red-50" : "bg-green-50"
            }`}
        >
          <Typography
            variant="subtitle1"
            className={
              factor?.remainingAmount < 0 ? "text-red-600" : "text-green-600"
            }
          >
            {factor?.remainingAmount < 0 ? "مبلغ بدهی" : "مبلغ باقیمانده"}
          </Typography>
          <Typography
            variant="h6"
            className={`mt-2 font-bold ${factor?.remainingAmount < 0 ? "text-red-600" : "text-green-600"
              }`}
          >
            {formatPrice(Math.abs(factor?.remainingAmount))}
          </Typography>
        </div>
      </div>

      {/* تراکنش‌ها */}
      {factor?.transactions && factor?.transactions.length > 0 && (
        <div elevation={1} className="p-2 rounded-sm">
          <Typography
            variant="h6"
            className="mb-4 font-bold text-gray-700 !text-sm border-b pb-2"
          >
            تراکنش‌های پرداخت
          </Typography>
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
                {factor?.transactions.map((tx) => (
                  <TableRow key={tx.transactionId}>
                    <TableCell>{tx.transactionId}</TableCell>
                    <TableCell>{tx.paymentGatewayTitle}</TableCell>
                    <TableCell>{formatPrice(tx.price)}</TableCell>
                    <TableCell>
                      {new Date(tx.transactionDate).toLocaleString("fa-IR")}
                    </TableCell>
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
        {factor?.partServices && factor?.partServices.length > 0 && (
          <>
            <Typography variant="subtitle1" className="pt-1 pb-2 text-gray-600">
              قطعات
            </Typography>
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
                  {factor?.partServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.title}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${service.warrantyServiceTypeId === 1
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                            }`}
                        >
                          {service.warrantyServiceTypeTitle}
                        </span>
                      </TableCell>
                      <TableCell>{service.qty}</TableCell>
                      <TableCell>
                        {formatPrice(service.totalPrice / service.qty)}
                      </TableCell>
                      <TableCell>{formatPrice(service.totalPrice)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* خدمات راه‌حل */}
        {factor?.solutionServices && factor?.solutionServices.length > 0 && (
          <>
            <Typography variant="subtitle1" className="pt-4 pb-2 text-gray-600">
              خدمات
            </Typography>
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
                  {factor?.solutionServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.title || "بدون عنوان"}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${service.warrantyServiceTypeId === 1
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                            }`}
                        >
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

      {/* Custom Flex Tabs */}
      <div className="w-full flex overflow-x-auto gap-2 p-1 rounded-xl">
        {paymentGateways.map((gateWay, index) => (
          <button
            key={gateWay.id}
            onClick={() => handleTabChange(index)}
            className={`flex-shrink-0 flex flex-row items-center p-2 rounded-lg transition-all ${activeTab === index
              ? "border-2 border-blue-600 bg-blue-50"
              : "border-2 border-transparent hover:border-gray-300"
              }`}
            disabled={isSubmitting}
          >
            <div className="relative w-12 h-12">
              <Image
                src={`/${gateWay.icon}`}
                alt={gateWay.title}
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xs pr-2">{gateWay.title}</span>
          </button>
        ))}
      </div>

      {/* Description Textarea */}

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
            startIcon={
              isSubmitting ? (
                <CircularProgress
                  size={20}
                  color="inherit"
                  sx={{ color: "white" }}
                />
              ) : null
            }
          >
            {command.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default RequestFactorPay;
