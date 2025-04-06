import React from "react";

// Dynamically import components
const PickOrganization = React.lazy(() => import("./PickOrganization"));
const DescriptionForm = React.lazy(() => import("./DescriptionForm"));
const PickTechnicalUserWithVisitTime = React.lazy(() => import("./PickTechnicalUserWithVisitTime"));

// Mapping object
export const formComponents = {
    PickOrganization,
    DescriptionForm,
    PickTechnicalUserWithVisitTime
};