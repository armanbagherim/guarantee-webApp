import React, { useEffect, useState } from "react";
import { Button, TextField, Autocomplete, Dialog } from "@mui/material";
import { toast } from "react-hot-toast";
import { fetcher } from "@/app/components/admin-components/fetcher";
import PickOrganizationModal from "./PickModals/Organization";
import { validateYupSchema } from "formik";

const PickOrganization = ({ currentOperation, nodeCommands, setAction, setTriggered, triggered, session, ...node }) => {
    const [organs, setOrgans] = useState([]); // State for organizations
    const [organId, setOrganId] = useState(null); // State for selected organization ID
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [description, setDescription] = useState("");
    const [organOpen, setOrganOpen] = useState({
        isOpen: false,
        value: null,
    });

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
                    organizationId: +organId, // Include selected organization ID
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
                {/* Autocomplete for organizations */}
                <button className="bg-gray-100 p-4 font-bold text-md w-full rounded-xl text-right" onClick={e => setOrganOpen({
                    ...organOpen,
                    isOpen: true,
                })}>{organOpen.value ?? "انتخاب نماینده"}</button>
                <Dialog open={organOpen.isOpen} onClose={() => setOrganOpen(
                    {
                        ...organOpen,
                        isOpen: false,
                    }
                )} fullWidth maxWidth="sm">
                    <div className="p-4">
                        <h2 className="text-lg font-bold mb-4">انتخاب سازمان</h2>
                        <PickOrganizationModal setOrganId={setOrganId} url={`/v1/api/guarantee/cartable/organizations/request/${currentOperation.requestId}`} setOrganOpen={setOrganOpen} />
                    </div>
                </Dialog>

                {/* Description textarea */}
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
        </div>
    );
};

export default PickOrganization;