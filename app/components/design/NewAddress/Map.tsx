"use client";

import React, { useState } from "react";
import MapClient from "../../admin-components/MapClient";

export default function Map({ data }) {
  console.log("bjjjjjjjjjjjjjjjjj", data.values.latitude);
  return (
    <div className="w-full relative block mb-8">
      <MapClient
        height={400}
        defaultLocation={{
          lat: data.values.latitude ?? "35.65326",
          lng: data.values?.longitude ?? "51.35471",
        }}
        onLocationChange={(location) => {
          data.setValues({
            ...data.values,
            latitude: location.lat.toString(),
            longitude: location.lng.toString(),
          });
        }}
      />
    </div>
  );
}
