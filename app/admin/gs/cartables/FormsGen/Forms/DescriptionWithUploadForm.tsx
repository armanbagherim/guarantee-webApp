import React, { useState } from "react";
import { Button } from "@mui/material";
import toast from "react-hot-toast";
import Uploader from "@/app/components/design/Uploader";

const DescriptionWithUploadForm = ({ currentOperation, nodeCommands, setAction, setTriggered, triggered, session, ...node }) => {
    const [description, setDescription] = useState("");
    const [photos, setPhotos] = useState([])

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
                    description,
                    attachments: photos.map((photo) => ({ attachmentId: photo.id }))
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
            <div className="mb-4">
                <span className="mb-3 text-bold block">اپلود تصویر محصول</span>
                <Uploader
                    photos={photos}
                    setPhotos={setPhotos}
                    location={"v1/api/guarantee/cartable/requestAttachments/image"}
                    type={"image"}
                    isFull={true}
                    token={session.token}
                />
            </div>
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

export default DescriptionWithUploadForm;