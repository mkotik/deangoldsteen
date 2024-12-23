"use client";

import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface MapProps {
  city: string;
  country: string;
}

export function Map({ city, country }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        version: "weekly",
      });

      const { Map } = await loader.importLibrary("maps");
      const { Geocoder } = await loader.importLibrary("geocoding");

      const geocoder = new Geocoder();

      geocoder.geocode(
        { address: `${city}, ${country}` },
        (results, status) => {
          if (status === "OK" && results && results[0]) {
            const map = new Map(mapRef.current as HTMLElement, {
              center: results[0].geometry.location,
              zoom: 13,
            });

            new google.maps.Marker({
              map: map,
              position: results[0].geometry.location,
            });
          } else {
            console.error(
              "Geocode was not successful for the following reason: " + status
            );
          }
        }
      );
    };

    initMap();
  }, [city, country]);

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
}
