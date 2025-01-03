/* eslint-disable */
/// <reference types="@types/google.maps" />
"use client";

import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Event } from "@/app/services/events";

interface MapProps {
  events: Event[];
  coordinates: { lat: number; lng: number } | null;
  loader: Loader;
  city: string;
  state: string;
  country: string;
}

export function Map({
  coordinates,
  events,
  loader,
  city,
  state,
  country,
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      if (!coordinates) return;

      const { Map: GoogleMap } = await loader.importLibrary("maps");
      const { AdvancedMarkerElement } = await loader.importLibrary("marker");

      const map = new GoogleMap(mapRef.current as HTMLElement, {
        center: coordinates,
        zoom: 13,
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID as string,
      });

      events.forEach((event) => {
        if (event.latitude && event.longitude) {
          const marker = new AdvancedMarkerElement({
            map,
            position: {
              lat: event.latitude,
              lng: event.longitude,
            },
            title: event.name || undefined,
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div>
                <h3>${event.name}</h3>
                <p>${event.venue}</p>
                <p>${event.address}</p>
                <p>Time: ${event.time}</p>
              </div>
            `,
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });
        }
      });
    };

    initMap();
  }, [coordinates, events]);

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
}
