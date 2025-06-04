import React, { useState } from "react";
import { Button } from "@mui/material";
import toast from "@/app/components/toast";

const DescriptionForm = ({ currentOperation, nodeCommands, setAction, setTriggered, triggered, session, ...node }) => {
    const [description, setDescription] = useState("");
    const handleButtonClick = async (command) => {
        console.log(command)
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
                    description
                }),
            });

            if (!response.ok) {
                let jsonRes = await response.json()
                let errorMessage = jsonRes.errors ? jsonRes.errors[0] : jsonRes.message;
                throw new Error(errorMessage);
            }

            const result = await response.json();
            setTriggered(!triggered)
            setAction((prev) => ({ ...prev, isOpen: false }))
            toast.success(result.result.message)
        } catch (error) {
            toast.error(error.message)

            console.error("Error:", error);
        }
    };

    return (
        <div className="flex flex-col justify-between">
            <div className="block mt-8">
                <textarea rows={12} onChange={e => setDescription(e.target.value)} className="w-full border border-gray-200 focus:border-blue-700 outline-none rounded-2xl p-4" placeholder="توضیحات" />
            </div>
            <div className="flex">{nodeCommands?.map((command) => (
                <Button
                    key={command.id}
                    variant="contained"
                    style={{ backgroundColor: command.nodeCommandType.commandColor, margin: "5px" }}
                    onClick={() => handleButtonClick(command)}
                >
                    {command.name}
                </Button>
            ))}</div>
        </div>
    );
};

export default DescriptionForm;