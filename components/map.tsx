"use client";

import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface MapProps {
  city: string;
  country: string;
  events: {
    name: string;
    venue: string;
    address: string;
    city: string;
    state: string;
    time: string;
  }[];
}

export function Map({ city, country, events }: MapProps) {
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

      // First set the map center to the main city
      geocoder.geocode(
        { address: `${city}, ${country}` },
        async (results, status) => {
          if (status === "OK" && results && results[0]) {
            const map = new Map(mapRef.current as HTMLElement, {
              center: results[0].geometry.location,
              zoom: 13,
            });

            // Now geocode and add markers for each event
            for (const event of events) {
              const address = `${event.address}, ${event.city}, ${event.state}`;

              try {
                const response = await new Promise((resolve, reject) => {
                  geocoder.geocode({ address }, (results, status) => {
                    if (status === "OK" && results && results[0]) {
                      resolve(results[0]);
                    } else {
                      reject(status);
                    }
                  });
                });

                const marker = new google.maps.Marker({
                  map: map,
                  position: response.geometry.location,
                });

                // Add info window for each marker
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
              } catch (error) {
                console.error(`Error geocoding ${address}:`, error);
              }
            }
          }
        }
      );
    };

    initMap();
  }, [city, country, events]);

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
}
