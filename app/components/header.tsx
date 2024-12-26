"use client";

import * as React from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/app/components/ui/navigation-menu";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

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

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <MapPin className="h-6 w-6" />
            <span className="text-xl font-bold">Open Mic Directory</span>
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                {Object.entries(regions).map(([region, cities]) => (
                  <NavigationMenuItem key={region}>
                    <NavigationMenuTrigger>{region}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-6 w-[400px]">
                        {cities.map((row, i) => (
                          <div key={i} className="flex gap-3">
                            {row.map((city) => (
                              <NavigationMenuLink
                                key={city}
                                asChild
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <Link
                                  href={`/${city
                                    .toLowerCase()
                                    .replace(" ", "-")}`}
                                >
                                  {city}
                                </Link>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            <Button variant="default">Post Your Open Mic</Button>
          </div>
        </div>
      </div>
    </header>
  );
}
