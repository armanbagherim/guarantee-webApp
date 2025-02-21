"use client";
import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Overlay from "ol/Overlay";
import { fromLonLat, toLonLat } from "ol/proj";
import { Icon, Style } from "ol/style";
import {
  defaults as defaultInteractions,
  DragRotateAndZoom,
} from "ol/interaction";
import { defaults as defaultControls, FullScreen } from "ol/control";
import Geocoder from "ol-geocoder";
import "ol/ol.css"; // Include OpenLayers styles

const MapComponent = ({ coordinates, setCoordinates }) => {
  const mapRef = useRef();
  const vectorLayerRef = useRef();
  const overlayRef = useRef();

  useEffect(() => {
    const rasterLayer = new TileLayer({
      source: new OSM(),
    });

    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });
    vectorLayerRef.current = vectorLayer;

    const overlay = new Overlay({
      element: document.getElementById("marker"),
      positioning: "bottom-center",
      stopEvent: false,
      offset: [0, -50],
    });
    overlayRef.current = overlay;

    const map = new Map({
      layers: [rasterLayer, vectorLayer],
      target: mapRef.current,
      view: new View({
        center: fromLonLat([51.3347, 35.7219]), // Tehran, Iran
        zoom: 12,
      }),
      interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
      controls: defaultControls().extend([new FullScreen()]),
      overlays: [overlay],
    });

    const geocoder = new Geocoder("nominatim", {
      provider: "osm",
      lang: "en",
      placeholder: "جست و جوی لوکیشن",
      limit: 5,
      autoComplete: true,
      keepOpen: true,
    });
    map.addControl(geocoder);

    map.on("singleclick", function (evt) {
      // Clear previous markers
      vectorSource.clear();

      // Add new marker
      const feature = new Feature(new Point(evt.coordinate));
      feature.setStyle(
        new Style({
          image: new Icon({
            anchor: [0.5, 46],
            anchorXUnits: "fraction",
            anchorYUnits: "pixels",
            src: "/icons/marker.png",
          }),
        })
      );
      vectorSource.addFeature(feature);

      const lonLat = toLonLat(evt.coordinate);

      overlay.setPosition(evt.coordinate);
      setCoordinates({
        latitude: lonLat[1],
        longitude: lonLat[0],
      });
    });

    return () => {
      map.dispose();
    };
  }, []);

  return (
    <div className="map" style={{ height: "600px" }} ref={mapRef}>
      <div id="marker" style={{ display: "none" }}></div>
    </div>
  );
};

export default MapComponent;
