import React from "react";

// Dynamically import components
const ClientPickShippingWay = React.lazy(() => import("./ClientPickShippingWay"));
const RequestFactorPay = React.lazy(() => import("./RequestFactorPay"));


// Mapping object
export const formComponents = {
    ClientPickShippingWay,
    RequestFactorPay
};