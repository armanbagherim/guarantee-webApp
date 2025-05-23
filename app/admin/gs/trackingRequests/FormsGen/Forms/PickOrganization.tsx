import React, { useEffect, useState } from "react";
import { Button, TextField, Autocomplete } from "@mui/material";
import toast from "react-hot-toast";
import { fetcher } from "@/app/components/admin-components/fetcher";

const PickOrganization = ({ currentOperation, nodeCommands, setAction, setTriggered, triggered, session, ...node }) => {
    const [organs, setOrgans] = useState([]); // State for organizations
    const [organId, setOrganId] = useState(null); // State for selected organization ID
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [description, setDescription] = useState("");

    // Fetch initial organizations on component mount
    useEffect(() => {
        const fetchInitialOrganizations = async () => {
            try {
                const res = await fetcher({
                    method: "GET",
                    url: `/v1/api/guarantee/cartable/organizations/request/${currentOperation.requestId}`,
                });
                setOrgans(res.result); // Update organizations state with initial data
            } catch (error) {
                console.error("Error fetching initial organizations:", error);
            }
        };

        fetchInitialOrganizations();
    }, [currentOperation.requestId]);

    // Fetch organizations based on search query
    const fetchOrganizations = async (query) => {
        try {
            const res = await fetcher({
                method: "GET",
                url: `/v1/api/guarantee/cartable/organizations/request/${currentOperation.requestId}?search=${query}`,
            });
            setOrgans(res.result); // Update organizations state
        } catch (error) {
            console.error("Error fetching organizations:", error);
        }
    };

    // Handle search input change
    const handleSearchChange = (event, value) => {
        setSearchQuery(value); // Update search query state
        if (value) {
            fetchOrganizations(value); // Fetch organizations only if there's a search query
        }
    };

    // Handle organization selection
    const handleOrganSelect = (event, value) => {
        setOrganId(value?.id || null); // Update selected organization ID
    };

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
                <Autocomplete
                    options={organs}
                    getOptionLabel={(option) => option.name} // Display organization name
                    onInputChange={handleSearchChange} // Handle search input change
                    onChange={handleOrganSelect} // Handle organization selection
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="انتخاب نماینده"
                            variant="outlined"
                            fullWidth
                        />
                    )}
                />

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