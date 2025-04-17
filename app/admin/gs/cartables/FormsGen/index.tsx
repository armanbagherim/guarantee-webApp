import * as React from "react";
import Dialog from "@mui/material/Dialog";
import { formComponents } from "./Forms/formComponents";
import { DialogContent, Tabs, Tab, Box, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function FormGen({ action, setAction, session, triggered, setTriggered }) {
    const [activeTab, setActiveTab] = React.useState(0); // State to track the active tab

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue); // Update the active tab when the user clicks a tab
    };

    return (
        <Dialog
            open={action.isOpen}
            onClose={() => setAction((prev) => ({ ...prev, isOpen: false }))}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="md" // Adjust the width as needed
            fullWidth
        >
            <DialogTitle>
                <IconButton
                    onClick={() => setAction((prev) => ({ ...prev, isOpen: false }))}
                    sx={{ marginLeft: "auto" }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {/* Tabs for each form */}
                <Tabs value={activeTab} centered onChange={handleTabChange}>
                    {action.currentOperation?.nodes?.map((node, index) => (
                        <Tab
                            key={node.id}
                            label={node.nodeCommands[0].name} // Use the command name as the tab label
                        />
                    ))}
                </Tabs>

                {/* Tab content (forms) */}
                {action?.currentOperation?.nodes?.map((node, index) => {
                    const FormComponent = formComponents[node.injectForm];

                    if (!FormComponent) {
                        return (
                            <Box key={node.id} hidden={activeTab !== index}>
                                <div>Form not found for {node.injectForm}</div>
                            </Box>
                        );
                    }

                    return (
                        <Box key={node.id} alignContent={"center"} hidden={activeTab !== index}>
                            <React.Suspense fallback={<div>Loading form...</div>}>
                                <FormComponent
                                    session={session}
                                    triggered={triggered}
                                    setTriggered={setTriggered}
                                    setAction={setAction}
                                    {...node} // Pass the node data
                                    currentOperation={action.currentOperation} // Pass the entire currentOperation object
                                />
                            </React.Suspense>
                        </Box>
                    );
                })}
            </DialogContent>
        </Dialog>
    );
}