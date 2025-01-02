/// <reference types="@types/google.maps" />
"use client";

import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Event } from "@/app/services/events";

interface MapProps {
  city: string;
  country: string;
  events: Event[];
}

export function Map({ city, country, events }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        version: "weekly",
        mapIds: [process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID as string],
      });

      const { Map: GoogleMap } = await loader.importLibrary("maps");
      const { AdvancedMarkerElement } = await loader.importLibrary("marker");

      const eventWithCoords = events.find(
        (event) => event.latitude && event.longitude
      );

      const map = new GoogleMap(mapRef.current as HTMLElement, {
        center: eventWithCoords
          ? { lat: eventWithCoords.latitude!, lng: eventWithCoords.longitude! }
          : { lat: 40.7128, lng: -74.006 },
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
  }, [city, country, events]);

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
}
