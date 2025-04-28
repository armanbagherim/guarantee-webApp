import React from "react";

// Dynamically import components
const PickOrganization = React.lazy(() => import("./PickOrganization"));
const DescriptionForm = React.lazy(() => import("./DescriptionForm"));
const PickTechnicalUserWithVisitTime = React.lazy(() => import("./PickTechnicalUserWithVisitTime"));
const SolutionAndParts = React.lazy(() => import("./SolutionAndParts"));
const PickTechnicalUser = React.lazy(() => import("./PickTechnicalUser"));
const PreFactorInLocation = React.lazy(() => import("./PreFactorInLocation"));
const PreFactor = React.lazy(() => import("./PreFactor"));

// Mapping object
export const formComponents = {
    PickOrganization,
    DescriptionForm,
    PickTechnicalUserWithVisitTime,
    SolutionAndParts,
    PickTechnicalUser,
    PreFactorInLocation,
    PreFactor,
};