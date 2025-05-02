import React, { useEffect, useState } from "react";
import { Button, TextField, Select, MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import { fetcher } from "@/app/components/admin-components/fetcher";
import Dialog from '@mui/material/Dialog';
import LightDataGrid from "@/app/components/admin-components/LightDataGrid/LightDataGrid";
import { columns } from "./columns";
import { FaPlus, FaTrash } from "react-icons/fa";
import { v4 as uuidv4 } from 'uuid';

const SolutionAndParts = ({ currentOperation, nodeCommands, setAction, setTriggered, triggered, session, ...node }) => {
    const [selectedSolutions, setSelectedSolutions] = useState([]);
    const [currentSolution, setCurrentSolution] = useState({
        solutionName: null,
        serviceTypeId: null,
        solutionId: null,
        serviceTypeName: null,
        fee: null
    });
    const [isSolutionOpen, setIsSolutionOpen] = useState(false);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [description, setDescription] = useState("");
    const [parts, setParts] = useState([]);
    const [currentPart, setCurrentPart] = useState({
        title: '',
        price: '',
        qty: '',
        serviceTypeId: '',
        id: ''
    });

    const fetchServiceTypes = async () => {
        try {
            const res = await fetcher({
                method: "GET",
                url: `/v1/api/guarantee/cartable/warrantyServiceTypes/request/${currentOperation.requestId}`,
            });
            setServiceTypes(res.result);
        } catch (error) {
            console.error("Error fetching service types:", error);
            toast.error("خطا در دریافت انواع خدمات");
        }
    };

    useEffect(() => {
        fetchServiceTypes();
    }, [currentOperation.requestId]);

    const handleAddSolution = () => {
        if (!currentSolution.solutionName || !currentSolution.serviceTypeId || !currentSolution.solutionId) {
            toast.error("لطفاً تمام فیلدهای خدمات را تکمیل کنید");
            return;
        }

        const exists = selectedSolutions.some(
            solution => solution.solutionId === currentSolution.solutionId
        );

        if (exists) {
            toast.error("این خدمات قبلاً اضافه شده است");
            return;
        }

        setSelectedSolutions(prev => [...prev, currentSolution]);
        setCurrentSolution({
            solutionName: null,
            serviceTypeId: null,
            solutionId: null,
            serviceTypeName: null,
            fee: null
        });
        setIsSolutionOpen(false);
        toast.success("خدمات با موفقیت اضافه شد");
    };

    const handleRemoveSolution = (solutionIdToRemove) => {
        setSelectedSolutions(prevSolutions =>
            prevSolutions.filter(solution => solution.solutionId !== solutionIdToRemove)
        );
        toast.success("خدمات با موفقیت حذف شد");
    };

    const handlePartChange = (e) => {
        const { name, value } = e.target;
        setCurrentPart(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddPart = () => {
        const { title, price, qty, serviceTypeId } = currentPart;

        if (!title || !price || !qty || !serviceTypeId) {
            toast.error("لطفاً تمام فیلدهای قطعه را تکمیل کنید");
            return;
        }

        const priceValue = Number(price.replace(/,/g, ''));
        const qtyValue = Number(qty);

        if (isNaN(priceValue) || isNaN(qtyValue)) {
            toast.error("لطفاً مقادیر معتبر برای قیمت و تعداد وارد کنید");
            return;
        }

        const newPart = {
            ...currentPart,
            id: uuidv4(),
            price: priceValue,
            qty: qtyValue
        };

        setParts(prev => [...prev, newPart]);
        setCurrentPart({
            title: '',
            price: '',
            qty: '',
            serviceTypeId: '',
            id: ''
        });
        toast.success("قطعه با موفقیت اضافه شد");
    };

    const handleRemovePart = (partId) => {
        setParts(prevParts => prevParts.filter(part => part.id !== partId));
        toast.success("قطعه با موفقیت حذف شد");
    };

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
                    solutionItems: selectedSolutions.map((solution) => ({
                        solutionId: solution.solutionId,
                        warrantyServiceType: solution.serviceTypeId
                    })),
                    partItems: parts.map((part) => ({
                        partName: part.title,
                        price: part.price,
                        qty: part.qty,
                        warrantyServiceType: part.serviceTypeId
                    }))
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
        <div className="flex flex-col justify-between gap-6">
            {/* Solutions Section */}
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-bold mb-4">خدمات</h3>
                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <div onClick={() => setIsSolutionOpen(true)} className="bg-gray-100 p-4 rounded-lg cursor-pointer">
                            {currentSolution.solutionName || 'انتخاب خدمات'}
                        </div>
                    </div>
                    <div className="flex-1">
                        <Select
                            className="adminSelect w-full"
                            value={currentSolution.serviceTypeId || ''}
                            onChange={(e) => {
                                const selectedId = e.target.value;
                                const selectedService = serviceTypes.find(st => st.id === selectedId);
                                setCurrentSolution({
                                    ...currentSolution,
                                    serviceTypeId: selectedId,
                                    serviceTypeName: selectedService?.title || null
                                });
                            }}
                            displayEmpty
                            fullWidth
                            variant="outlined"
                        >
                            <MenuItem value="" disabled>
                                نوع خدمات را انتخاب کنید
                            </MenuItem>
                            {serviceTypes?.map((serviceType) => (
                                <MenuItem key={serviceType.id} value={serviceType.id}>
                                    {serviceType.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                    <button
                        className="bg-green-500 text-white rounded-xl p-4"
                        onClick={handleAddSolution}
                    >
                        <FaPlus />
                    </button>
                </div>

                <Dialog open={isSolutionOpen} onClose={() => setIsSolutionOpen(false)}>
                    <LightDataGrid
                        triggered={triggered}
                        url={`/v1/api/guarantee/cartable/solutions?requestId=${currentOperation.requestId}`}
                        columns={columns(setCurrentSolution, currentSolution, setIsSolutionOpen)}
                    />
                </Dialog>

                {selectedSolutions.length > 0 && (
                    <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-right">خدمات</th>
                                    <th className="px-6 py-3 text-right">شرایط گارانتی</th>
                                    <th className="px-6 py-3 text-right">قیمت</th>
                                    <th className="px-6 py-3 text-right">عملیات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedSolutions.map((solution) => (
                                    <tr key={solution.solutionId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">{solution.solutionName}</td>
                                        <td className="px-6 py-4">{solution.serviceTypeName}</td>
                                        <td className="px-6 py-4">{solution.fee?.toLocaleString()} تومان</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleRemoveSolution(solution.solutionId)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Parts Section */}
            <div className="bg-white p-4 rounded-lg shadow w-full">
                <h3 className="text-lg font-bold mb-4">قطعات</h3>
                <div className="flex gap-4 mb-4 w-full">
                    <div className="w-full">
                        <div className="flex gap-2">
                            <TextField
                                name="title"
                                label="عنوان قطعه"
                                value={currentPart.title}
                                onChange={handlePartChange}
                                fullWidth
                            />
                            <TextField
                                name="price"
                                label="قیمت (تومان)"
                                value={currentPart.price}
                                onChange={handlePartChange}
                                fullWidth
                            />
                            <TextField
                                name="qty"
                                label="تعداد"
                                value={currentPart.qty}
                                onChange={handlePartChange}
                                fullWidth
                            />
                        </div>
                        <div className="flex gap-4 mt-2">
                            <Select
                                name="serviceTypeId"
                                className="adminSelect w-full"
                                value={currentPart.serviceTypeId}
                                onChange={(e) => setCurrentPart(prev => ({ ...prev, serviceTypeId: e.target.value }))}
                                displayEmpty
                                fullWidth
                            >
                                <MenuItem value="" disabled>نوع خدمات</MenuItem>
                                {serviceTypes.map(service => (
                                    <MenuItem key={service.id} value={service.id}>{service.title}</MenuItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <button
                        className="bg-blue-500 text-white rounded-xl p-4"
                        onClick={handleAddPart}
                    >
                        <FaPlus />
                    </button>
                </div>
                {parts.length > 0 && (
                    <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-right">عنوان</th>
                                    <th className="px-6 py-3 text-right">قیمت</th>
                                    <th className="px-6 py-3 text-right">تعداد</th>
                                    <th className="px-6 py-3 text-right">نوع خدمات</th>
                                    <th className="px-6 py-3 text-right">عملیات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parts.map((part) => (
                                    <tr key={part.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">{part.title}</td>
                                        <td className="px-6 py-4">{part.price.toLocaleString()} تومان</td>
                                        <td className="px-6 py-4">{part.qty}</td>
                                        <td className="px-6 py-4">
                                            {serviceTypes.find(st => st.id === part.serviceTypeId)?.title || "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleRemovePart(part.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Description */}
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-bold mb-4">توضیحات</h3>
                <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3"
                    placeholder="توضیحات خود را وارد کنید..."
                />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
                {nodeCommands?.map((command) => (
                    <Button
                        key={command.id}
                        variant="contained"
                        style={{ backgroundColor: command.nodeCommandType.commandColor }}
                        onClick={() => handleButtonClick(command)}
                    >
                        {command.name}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default SolutionAndParts;
