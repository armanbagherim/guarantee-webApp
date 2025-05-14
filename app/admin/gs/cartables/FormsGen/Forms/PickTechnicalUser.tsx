import React, { useEffect, useState } from "react";
import { Button, TextField, Autocomplete, Dialog } from "@mui/material";
import { toast } from "react-toastify";
import { fetcher } from "@/app/components/admin-components/fetcher";
import DatePickerPersian from "@/app/components/utils/DatePicker";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import 'dayjs/locale/fa';
import dayjs from "dayjs";
import PickTechUserModal from "./PickModals/TechUser";

const PickTechnicalUser = ({ currentOperation, nodeCommands, setAction, setTriggered, triggered, session, ...node }) => {
    const [technicalUser, setTechnicalUser] = useState([]);
    const [technicalId, setTechnicalId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [time, setTime] = useState(null);
    const [organOpen, setOrganOpen] = useState({
        isOpen: false,
        value: null,
    });
    // Fetch initial organizations on component mount

    // Handle button click (submit form)
    const handleButtonClick = async (command) => {
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
                }),
            });

            if (!response.ok) {
                let jsonRes = await response.json()
                let errorMessage = jsonRes.errors ? jsonRes.errors[0] : jsonRes.message;
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

                <button className="bg-gray-100 p-4 font-bold text-md w-full rounded-xl text-right" onClick={e => setOrganOpen({
                    ...organOpen,
                    isOpen: true,
                })}>{organOpen.value ?? "انتخاب تکنسین"}</button>

                <Dialog open={organOpen.isOpen} onClose={() => setOrganOpen(
                    {
                        ...organOpen,
                        isOpen: false,
                    }
                )} fullWidth maxWidth="sm">
                    <div className="p-4">
                        <h2 className="text-lg font-bold mb-4">انتخاب تکنسین</h2>
                        <PickTechUserModal setOrganId={setTechnicalId} url={`/v1/api/guarantee/cartable/technicalUsers/request/${currentOperation.requestId}`} setOrganOpen={setOrganOpen} />
                    </div>
                </Dialog>

                <textarea
                    rows={12}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-200 focus:border-blue-700 outline-none rounded-2xl p-4 mt-4"
                    placeholder="توضیحات"
                />
            </div>

            {/* Buttons for node commands */}
            <div className="flex">
                {nodeCommands?.map((command) => (
                    <Button
                        key={command.id}
                        variant="contained"
                        style={{ backgroundColor: command.nodeCommandType.commandColor, margin: "5px" }}
                        onClick={() => handleButtonClick(command)}
                    >
                        {command.name}
                    </Button>
                ))}
            </div>
        </div >
    );
};

export default PickTechnicalUser;