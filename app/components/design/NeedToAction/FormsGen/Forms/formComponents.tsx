import React from "react";

// Dynamically import components
const ClientPickShippingWay = React.lazy(() => import("./ClientPickShippingWay"));
const RequestFactorPay = React.lazy(() => import("./RequestFactorPay"));
const SurveyForm = React.lazy(() => import("./SurveyForm"));


// Mapping object
export const formComponents = {
    ClientPickShippingWay,
    RequestFactorPay,
    SurveyForm,
};