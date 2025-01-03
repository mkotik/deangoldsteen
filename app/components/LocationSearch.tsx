"use client";

import { useEffect, useRef } from "react";
import { Input } from "@/app/components/ui/input";

interface LocationSearchProps {
  onPlaceSelect: (city: string, region: string) => void;
  selectedPlace: google.maps.places.PlaceResult | null;
  setSelectedPlace: (place: google.maps.places.PlaceResult | null) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function LocationSearch({
  setSelectedPlace,
  onKeyDown,
}: LocationSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

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
      setSelectedPlace(place);
    });

    return () => {
      google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, []);

  return (
    <Input
      ref={inputRef}
      type="text"
      placeholder="Enter a city..."
      className="w-full"
      onKeyDown={onKeyDown}
    />
  );
}
