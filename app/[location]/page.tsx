"use client";

import { Map } from "@/app/components/map";
import { getEvents, Event } from "@/app/services/events";
import { useState, useEffect } from "react";
import { DatePicker } from "@/app/components/ui/date-picker";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { format, addDays } from "date-fns";
import { useParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { Info, MapPin, Phone, LinkIcon } from "lucide-react";
import { filterEventsByDate } from "@/app/utils/filterEventsByDate";
import { EventDetailsModal } from "@/app/components/EventDetailsModal";
import { Loader } from "@googlemaps/js-api-loader";

export default function LocationPage() {
  const params = useParams();
  const location = (params.location as string).replace(/-/g, " ");
  const decodedLocation = decodeURIComponent(location);
  const [city, state, country] = decodedLocation
    .split(",")
    .map((part) => part.trim());
  const [events, setEvents] = useState<Event[]>([]);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  const maxDate = addDays(new Date(), 30);
  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    version: "weekly",
  });
  useEffect(() => {
    async function getCoordinates() {
      const { Geocoder } = await loader.importLibrary("geocoding");
      const geocoder = new Geocoder();

      try {
        const response = await geocoder.geocode({
          address: `${city}, ${state}, ${country}`,
        });

        if (response.results[0]?.geometry?.location) {
          const { lat, lng } = response.results[0].geometry.location;
          setCoordinates({ lat: lat(), lng: lng() });
        }
      } catch (error) {
        console.error("Error geocoding location:", error);
      }
    }

    getCoordinates();
  }, [city, state, country]);

  useEffect(() => {
    async function fetchEvents() {
      if (coordinates) {
        // const data = await getEvents(coordinates);
        const data = await getEvents(city);
        setEvents(data);
      }
    }
    fetchEvents();
  }, [coordinates]);

  useEffect(() => {
    if (selectedDate) {
      const filteredEvents = filterEventsByDate(events, selectedDate);
      setFilteredEvents(filteredEvents);
    }
  }, [events]);

  useEffect(() => {
    if (selectedDate) {
      const filteredEvents = filterEventsByDate(events, selectedDate);
      console.log("Filtered events:", filteredEvents);
      setFilteredEvents(filteredEvents);
    }
  }, [selectedDate]);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Open Mic Events in {city}</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <Map
            loader={loader}
            coordinates={coordinates}
            city={city}
            state={state}
            country={country || "United States"}
            events={filteredEvents}
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
        </div>
      </div>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Event Name</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event, index) => (
                <TableRow key={index}>
                  <TableCell>{event.time}</TableCell>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>{event.venue}</TableCell>
                  <TableCell>{event.frequency}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        event.cost?.toLowerCase() === "free"
                          ? "secondary"
                          : "default"
                      }
                    >
                      {event.cost}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsModalOpen(true);
                      }}
                      className="cursor-pointer"
                    >
                      <Info className="text-gray-500 hover:text-gray-700" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {selectedEvent && (
            <EventDetailsModal
              event={selectedEvent}
              isOpen={isModalOpen}
              selectedDate={selectedDate}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedEvent(null);
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
