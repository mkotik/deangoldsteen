"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/app/components/ui/input";
import { useRouter } from "next/navigation";

export function LocationSearch() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const options = {
      types: ["(cities)"],
      componentRestrictions: { country: ["us", "ca"] },
      fields: ["address_components", "geometry", "name"],
    };

    const autocomplete = new google.maps.places.Autocomplete(
      inputRef.current,
      options
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.address_components) return;

      const city = place.address_components.find(
        (component) =>
          component.types.includes("locality") ||
          component.types.includes("sublocality")
      )?.long_name;

      if (city) {
        const formattedCity = city.toLowerCase().replace(/\s+/g, "-");
        router.push(`/${formattedCity}`);
      }
    });

    setAutocomplete(autocomplete);

    return () => {
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [router]);

  return (
    <Input
      ref={inputRef}
      type="text"
      placeholder="Enter a city..."
      className="w-full"
    />
  );
}
