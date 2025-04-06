import React, { useEffect, useState, startTransition } from "react";
import { Button, TextField, Box } from "@mui/material";
import { toast } from "react-toastify";
import { fetcher } from "@/app/components/admin-components/fetcher";
import Image from "next/image";
import 'dayjs/locale/fa';
import dayjs from "dayjs";
import { useRouter } from 'next/navigation';

const PickTechnicalUserWithVisitTime = ({ currentOperation, nodeCommands, setAction, setTriggered, triggered, session, ...node }) => {
    const [shippingWays, setShippingWays] = useState([]);
    const [selectedShippingWay, setSelectedShippingWay] = useState(null);
    const [description, setDescription] = useState("");
    const [activeTab, setActiveTab] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
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
            }
        };

        fetchShipmentWays();
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
                    clientShipmentWayTrackingCode: description,
                    clientShipmentWayId: +selectedShippingWay,
                }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();

            startTransition(() => {
                setTriggered(!triggered);
                setAction((prev) => ({ ...prev, isOpen: false }));
                router.refresh(); // Refresh the page
            });

            toast.success(result.result.message);
        } catch (error) {
            toast.error(error.message);
            console.error("Error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col justify-between gap-4 p-4">
            {/* Custom Flex Tabs */}
            <div className="w-full flex overflow-x-auto gap-2 p-1 rounded-xl">
                {shippingWays.map((way, index) => (
                    <button
                        key={way.id}
                        onClick={() => handleTabChange(index)}
                        className={`flex-shrink-0 flex flex-row items-center p-2 rounded-lg transition-all ${activeTab === index
                            ? 'border-2 border-blue-600 bg-blue-50'
                            : 'border-2 border-transparent hover:border-gray-300'}`}
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
                    >
                        {isSubmitting ? (
                            <span className="flex items-center text-white">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                در حال پردازش...
                            </span>
                        ) : (
                            command.name
                        )}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default PickTechnicalUserWithVisitTime;