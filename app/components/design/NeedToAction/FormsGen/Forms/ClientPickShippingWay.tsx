import React, { useEffect, useState, startTransition } from "react";
import {
  Button,
  TextField,
  Box,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import toast from "react-hot-toast";
import { fetcher } from "@/app/components/admin-components/fetcher";
import Image from "next/image";
import "dayjs/locale/fa";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import concat from "@/app/components/utils/AddressConcat";
import BusinessIcon from "@mui/icons-material/Business";

const ClientPickShippingWay = ({
  currentOperation,
  nodeCommands,
  setAction,
  setTriggered,
  triggered,
  session,
  ...node
}) => {
  const [shippingWays, setShippingWays] = useState([]);
  const [organizationAddress, setOrganizationAddress] = useState();
  const [selectedShippingWay, setSelectedShippingWay] = useState(null);
  const [description, setDescription] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // New loading state for initial data
  const router = useRouter();

  const fetchShipmentWays = async () => {
    try {
      const res = await fetcher({
        method: "GET",
        url: `/v1/api/guarantee/client/shippingWays/request/${currentOperation.requestId}`,
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

  const fetchOrganizationAddress = async () => {
    try {
      const res = await fetcher({
        method: "GET",
        url: `/v1/api/guarantee/client/organizationAddress/request/${currentOperation.requestId}`,
      });
      setOrganizationAddress(res.result);
    } catch (error) {
      console.error("Error fetching organization address:", error);
      toast.error("خطا در دریافت آدرس نماینده");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchOrganizationAddress(), fetchShipmentWays()]);
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

  const handleButtonClick = async (command) => {
    if (!selectedShippingWay) {
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
            clientShipmentWayTrackingCode: description,
            clientShipmentWayId: +selectedShippingWay,
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
      <div className="bg-red-100 text-center text-red-700 py-2 px-4 rounded-lg">
        لطفا روی بسته خود حتما شماره رهگیری و نام و خانوادگی و به همراه شماره
        تماس را ثبت بفرمایید
      </div>
      <div className="bg-gray-100 p-4 rounded-lg">
        <h4 className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold">
              ارسال کالا به نمایندگی{" "}
            </span>
            <span className="font-bold">
              {organizationAddress?.orgnizationDetail?.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">با شماره تماس: </span>
            <span>{organizationAddress?.orgnizationDetail?.phoneNumber}</span>
          </div>
        </h4>
        <h4 className=" text-primary mb-2">آدرس محل ارسال</h4>
        <div className="flex items-center gap-2 bg-white rounded-lg p-2">
          <BusinessIcon /> {concat(organizationAddress?.address)}
        </div>
      </div>

      {/* Custom Flex Tabs */}
      <div className="w-full flex overflow-x-auto gap-2 p-1 rounded-xl">
        {shippingWays.map((way, index) => (
          <button
            key={way.id}
            onClick={() => handleTabChange(index)}
            className={`flex-shrink-0 flex flex-row items-center p-2 rounded-lg transition-all ${activeTab === index
              ? "border-2 border-blue-600 bg-blue-50"
              : "border-2 border-transparent hover:border-gray-300"
              }`}
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

export default ClientPickShippingWay;
