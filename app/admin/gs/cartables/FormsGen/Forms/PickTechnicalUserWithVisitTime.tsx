import React, { useState } from "react";
import {
    Button,
    Dialog,
    Chip
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { toast } from "react-hot-toast";
import { fetcher } from "@/app/components/admin-components/fetcher";
import DatePickerPersian from "@/app/components/utils/DatePicker";
import PickTechUserModal from "./PickModals/TechUser";

const PickTechnicalUserWithVisitTime = ({
    currentOperation,
    nodeCommands,
    setAction,
    setTriggered,
    triggered,
    session,
    ...node
}) => {
    const [technicalId, setTechnicalId] = useState(null);
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [time, setTime] = useState(null);
    const [organOpen, setOrganOpen] = useState({
        isOpen: false,
        value: null,
    });

    // ایجاد بازه‌های ۲ ساعته با فرمت ۲۴ ساعته برای ارسال و نمایش
    const timeSlots = Array.from({ length: 12 }, (_, i) => {
        const start = i * 2;
        const end = (start + 2) % 24;

        const format = (h) => `${h.toString().padStart(2, "0")}:00`;
        const range = `${format(start)} تا ${format(end)}`;

        return { label: range, value: range };
    });

    const handleButtonClick = async (command) => {
        if (!technicalId) {
            toast.error("لطفاً تکنسین را انتخاب کنید.");
            return;
        }

        if (!startDate || !time) {
            toast.error("تاریخ و ساعت حضور را انتخاب کنید.");
            return;
        }

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
                    userId: +technicalId,
                    technicalUserVisitDate: startDate,
                    technicalUserVisitTime: time, // رشته کامل مانند "14:00 تا 16:00"
                }),
            });

            if (!response.ok) {
                const jsonRes = await response.json();
                const errorMessage = jsonRes.errors ? jsonRes.errors[0] : jsonRes.message;
                throw new Error(errorMessage);
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

    return (
        <div className="flex flex-col justify-between">
            <div className="block mt-8">
                {/* دکمه انتخاب تکنسین */}
                <button
                    className="bg-gray-100 p-4 font-bold text-md w-full rounded-xl text-right"
                    onClick={() =>
                        setOrganOpen({
                            ...organOpen,
                            isOpen: true,
                        })
                    }
                >
                    {organOpen.value ?? "انتخاب تکنسین"}
                </button>

                {/* مودال انتخاب تکنسین */}
                <Dialog
                    open={organOpen.isOpen}
                    onClose={() =>
                        setOrganOpen({
                            ...organOpen,
                            isOpen: false,
                        })
                    }
                    fullWidth
                    maxWidth="sm"
                >
                    <div className="p-4">
                        <h2 className="text-lg font-bold mb-4">انتخاب تکنسین</h2>
                        <PickTechUserModal
                            setOrganId={setTechnicalId}
                            url={`/v1/api/guarantee/cartable/technicalUsers/request/${currentOperation.requestId}`}
                            setOrganOpen={setOrganOpen}
                        />
                    </div>
                </Dialog>

                {/* انتخاب تاریخ */}
                <DatePickerPersian
                    label="تاریخ حضور تکنسین"
                    date={startDate}
                    onChange={(e) => setStartDate(new Date(e).toISOString())}
                />

                {/* چیپ‌های بازه زمانی */}
                <div className="w-full mt-4">
                    <label className="font-semibold mb-2 block">ساعت حضور تکنسین</label>
                    <div className="flex flex-wrap gap-2">
                        {timeSlots.map((slot) => (
                            <Chip
                                key={slot.value}
                                label={slot.label}
                                clickable
                                onClick={() => setTime(slot.value)}
                                icon={time === slot.value ? <CheckIcon style={{ color: "#fff" }} /> : null}
                                style={{
                                    backgroundColor: time === slot.value ? "#1976d2" : "#e0e0e0",
                                    color: time === slot.value ? "#fff" : "#000",
                                    borderRadius: "16px",
                                    fontWeight: time === slot.value ? "bold" : "normal"
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* فیلد توضیحات */}
                <textarea
                    rows={6}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-200 focus:border-blue-700 outline-none rounded-2xl p-4 mt-4"
                    placeholder="توضیحات"
                />
            </div>

            {/* دکمه‌های عملیات */}
            <div className="flex flex-wrap mt-4">
                {nodeCommands?.map((command) => (
                    <Button
                        key={command.id}
                        variant="contained"
                        style={{
                            backgroundColor: command.nodeCommandType.commandColor,
                            margin: "5px",
                        }}
                        onClick={() => handleButtonClick(command)}
                    >
                        {command.name}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default PickTechnicalUserWithVisitTime;
