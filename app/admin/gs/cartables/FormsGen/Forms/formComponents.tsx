import React from "react";

// Dynamically import components
const PickOrganization = React.lazy(() => import("./PickOrganization"));
const DescriptionForm = React.lazy(() => import("./DescriptionForm"));

// Mapping object
export const formComponents = {
    PickOrganization,
    DescriptionForm,
};