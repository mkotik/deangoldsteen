"use client";

import * as React from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Button } from "@/app/components/ui/button";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        {/* Mobile Layout */}
        <div className="flex flex-col space-y-4 sm:hidden">
          <Link href="/" className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span className="text-lg font-bold">Dean Goldsteen Directory</span>
          </Link>
          <div className="relative">
            <Button variant="default" className="w-full" disabled>
              Post Your Open Mic
            </Button>
            <span className="absolute -top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              Coming Soon
            </span>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <MapPin className="h-6 w-6" />
            <span className="text-xl font-bold">Dean Goldsteen Directory</span>
          </Link>
          <div className="relative">
            <Button variant="default" disabled>
              Post Your Open Mic
            </Button>
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              Coming Soon
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
