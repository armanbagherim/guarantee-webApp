"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
// import "@neshan-maps-platform/mapbox-gl-react/dist/style.css";
import mapboxgl from "@neshan-maps-platform/mapbox-gl";
import Image from "next/image";

const DEFAULT_LOCATION = {
  lat: 35.65326,
  lng: 51.35471,
};

interface LocationState {
  lat: number | null;
  lng: number | null;
}

export interface MapProps {
  height?: number | string;
  defaultLocation?: LocationState;
  onAddressChange?: (address: string) => void;
  onLocationChange?: (location: LocationState) => void;
  isAddressManuallyChanged?: boolean;
}

const Maps: React.FC<MapProps> = ({
  defaultLocation = DEFAULT_LOCATION,
  onAddressChange,
  onLocationChange,
  isAddressManuallyChanged = false,
  height = 200,
}) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null); // Ref for the marker div
  const [currentLocation, setCurrentLocation] = useState<LocationState>({
    lat: null,
    lng: null,
  });
  const [lastLocation, setLastLocation] = useState<LocationState | null>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        mapType: mapboxgl.Map.mapTypes.neshanVector,
        container: mapContainerRef.current,
        zoom: 12,
        pitch: 0,
        center: [defaultLocation.lng, defaultLocation.lat],
        minZoom: 2,
        maxZoom: 21,
        trackResize: true,
        mapKey: "web.406947dbe1494fccabfb752c9e53152f",
        poi: false,
        traffic: false,
        mapTypeControllerOptions: {
          show: false,
        },
      }) as unknown as mapboxgl.Map;
    }

    return () => mapRef.current?.remove();
  }, []);

  useEffect(() => {
    const neshanMap = mapRef.current;
    if (neshanMap) {
      neshanMap.on("moveend", () => {
        if (neshanMap) {
          const center = neshanMap.getCenter();
          const newLocation = { lat: center.lat, lng: center.lng };

          if (
            !lastLocation ||
            lastLocation.lat !== newLocation.lat ||
            lastLocation.lng !== newLocation.lng
          ) {
            console.log("Location changed:", newLocation);
            setCurrentLocation(newLocation);
            setLastLocation(newLocation);
            onLocationChange?.(newLocation);
          }
        }
      });
    }
  }, []); // Empty dependency array, runs only once after map is initialized

  useEffect(() => {
    if (
      mapRef.current &&
      currentLocation.lat &&
      currentLocation.lng &&
      (currentLocation.lat !== lastLocation?.lat ||
        currentLocation.lng !== lastLocation?.lng)
    ) {
      mapRef.current.setCenter([currentLocation.lng, currentLocation.lat]);
      if (markerRef.current) {
        // Update marker position
        markerRef.current.style.left = `${getPixelX(
          currentLocation.lng,
          currentLocation.lat
        )}px`;
        markerRef.current.style.top = `${getPixelY(
          currentLocation.lng,
          currentLocation.lat
        )}px`;
      }
      if (!isAddressManuallyChanged) {
        onAddressChange?.("Address will be updated here");
      }
    }
  }, [
    currentLocation,
    isAddressManuallyChanged,
    onAddressChange,
    lastLocation,
  ]);

  const getPixelX = (lng, lat) => {
    if (mapRef.current) {
      const point = mapRef.current.project([lng, lat]);
      return point.x;
    }
    return 0;
  };

  const getPixelY = (lng, lat) => {
    if (mapRef.current) {
      const point = mapRef.current.project([lng, lat]);
      return point.y;
    }
    return 0;
  };

  return (
    <div
      style={{ height: `${height}px`, width: "100%", position: "relative" }}
      ref={mapContainerRef}
    >
      <div ref={markerRef} className="marker">
        <Image
          alt=""
          width={114}
          height={114}
          src={"/assets/map/img_pin.png"}
        />
      </div>
    </div>
  );
};

export default memo(Maps);
