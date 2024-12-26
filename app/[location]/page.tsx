"use client";

import { Map } from "@/app/components/map";
import { getEvents, Event } from "@/app/services/events";
import { useState, useEffect } from "react";
import { DatePicker } from "@/app/components/ui/date-picker";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { format, addDays } from "date-fns";

export default function LocationPage({
  params,
}: {
  params: { location: string };
}) {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const maxDate = addDays(new Date(), 30);

  const location = params.location.replace(/-/g, " ");
  const decodedLocation = decodeURIComponent(location);
  const [city, country] = decodedLocation.split(",").map((part) => part.trim());

  useEffect(() => {
    async function fetchEvents() {
      const data = await getEvents(city);
      console.log(data);
      setEvents(data);
    }
    fetchEvents();
  }, [city]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Open Mic Events in {city}</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <Map
            city={city}
            country={country || "United States"}
            events={events}
          />
        </div>
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <DatePicker
                selected={selectedDate}
                onSelect={setSelectedDate}
                minDate={new Date()}
                maxDate={maxDate}
              />
            </CardContent>
          </Card>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>
                Events on{" "}
                {selectedDate
                  ? format(selectedDate, "MMMM d, yyyy")
                  : "Selected Date"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                No events scheduled for this date. Check back later or be the
                first to post an event!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
