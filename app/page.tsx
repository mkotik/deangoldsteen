"use client";

import Link from "next/link";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Search } from "lucide-react";
import { LocationSearch } from "@/app/components/LocationSearch";
import { useRouter } from "next/navigation";
import { useState } from "react";

const regions = {
  "United States": [
    ["New York", "Los Angeles", "Chicago", "Austin"],
    ["Las Vegas", "Philadelphia", "Boston", "Atlanta"],
    ["Seattle", "Denver", "San Francisco"],
  ],
  Canada: [
    ["Toronto", "Vancouver", "Montreal", "Calgary"],
    ["Edmonton", "Ottawa", "Victoria", "Halifax"],
  ],
  Europe: [
    ["London", "Paris", "Berlin", "Rome"],
    ["Madrid", "Amsterdam", "Vienna", "Prague"],
  ],
};

export default function HomePage() {
  const router = useRouter();
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Find Open Mic Events Near You
        </h1>
        <p className="text-muted-foreground mb-8">
          Discover open mic opportunities in your city across the United States,
          Canada, and Europe
        </p>
        <div className="flex gap-2">
          <div className="flex-1">
            <LocationSearch
              selectedPlace={selectedPlace}
              setSelectedPlace={setSelectedPlace}
              onPlaceSelect={(city, region) => {
                const formattedCity = city.toLowerCase().replace(/\s+/g, "-");
                router.push(`/${formattedCity},${region}`);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && selectedPlace?.address_components) {
                  const city = selectedPlace.address_components.find(
                    (component) =>
                      component.types.includes("locality") ||
                      component.types.includes("sublocality")
                  )?.long_name;

                  const state = selectedPlace.address_components.find(
                    (component) =>
                      component.types.includes("administrative_area_level_1")
                  )?.short_name;

                  const country = selectedPlace.address_components.find(
                    (component) => component.types.includes("country")
                  )?.long_name;

                  console.log(city, state, country);

                  if (city && state && country) {
                    const formattedCity = city
                      .toLowerCase()
                      .replace(/\s+/g, "-");
                    router.push(`/${formattedCity}-${state},${country}`);
                  }
                }
              }}
            />
          </div>
          <Button
            onClick={() => {
              if (selectedPlace?.address_components) {
                const city = selectedPlace.address_components.find(
                  (component) =>
                    component.types.includes("locality") ||
                    component.types.includes("sublocality")
                )?.long_name;

                const state = selectedPlace.address_components.find(
                  (component) =>
                    component.types.includes("administrative_area_level_1")
                )?.short_name;

                const country = selectedPlace.address_components.find(
                  (component) => component.types.includes("country")
                )?.long_name;

                if (city && state && country) {
                  const formattedCity = city.toLowerCase().replace(/\s+/g, "-");
                  router.push(`/${formattedCity}-${state},${country}`);
                }
              }
            }}
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </section>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(regions).map(([region, cities]) => (
          <Card key={region}>
            <CardHeader>
              <CardTitle>{region}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-2 gap-2">
                {cities.flat().map((city) => (
                  <li key={city}>
                    <Button
                      variant="link"
                      className="text-left w-full justify-start p-0 h-auto"
                      asChild
                    >
                      <Link
                        href={`/${city
                          .toLowerCase()
                          .replace(" ", "-")},${region}`}
                      >
                        {city}
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
