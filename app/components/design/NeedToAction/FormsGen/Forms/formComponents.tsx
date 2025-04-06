import React from "react";

// Dynamically import components
const ClientPickShippingWay = React.lazy(() => import("./ClientPickShippingWay"));


// Mapping object
export const formComponents = {
    ClientPickShippingWay
};