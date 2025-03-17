"use client";

import React, { useEffect, useCallback } from "react";
import MapClient from "../../admin-components/MapClient";

export default function Map({ data, isAdmin = false }) {
  useEffect(() => {
    console.log("updated values in UseEffect", data.values);
  }, [data]);

  // Use useCallback to ensure handleLocationChange always has the latest data
  const handleLocationChange = useCallback(
    (location) => {
      console.log("Before update", data.values);

      // Update latitude and longitude using setFieldValue
      if (isAdmin) {
        // For admin, update address.latitude and address.longitude
        data.setFieldValue("address.latitude", location.lat.toString());
        data.setFieldValue("address.longitude", location.lng.toString());
      } else {
        // For non-admin, update root latitude and longitude
        data.setFieldValue("latitude", location.lat.toString());
        data.setFieldValue("longitude", location.lng.toString());
      }

      // Log to see if values are updated correctly
      console.log("After update", data.values);
    },
    [data, isAdmin] // Recreate the function when data or isAdmin changes
  );

  // Get the default latitude and longitude based on isAdmin
  const defaultLatitude = isAdmin
    ? data.values.address?.latitude ?? "35.65326"
    : data.values.latitude ?? "35.65326";

  const defaultLongitude = isAdmin
    ? data.values.address?.longitude ?? "51.35471"
    : data.values.longitude ?? "51.35471";

  return (
    <div className="w-full relative block mb-8">
      <MapClient
        height={400}
        defaultLocation={{
          lat: parseFloat(defaultLatitude), // Ensure it's a number
          lng: parseFloat(defaultLongitude), // Ensure it's a number
        }}
        onLocationChange={handleLocationChange}
      />
    </div>
  );
}
