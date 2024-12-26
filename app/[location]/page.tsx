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
import { format, addDays, isSameDay } from "date-fns";
import { useParams } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
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

export default function LocationPage() {
  const params = useParams();
  const location = (params.location as string).replace(/-/g, " ");
  const decodedLocation = decodeURIComponent(location);
  const [city, country] = decodedLocation.split(",").map((part) => part.trim());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const maxDate = addDays(new Date(), 30);

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
        </div>
      </div>
      <Card>
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
              {events.map((event, index) => (
                <TableRow key={index}>
                  <TableCell>{event.time}</TableCell>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="underline decoration-dotted">
                          {event.venue}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            <MapPin className="inline mr-2" size={16} />
                            {event.address}, {event.city}, {event.state}
                          </p>
                          {event.phone && (
                            <p>
                              <Phone className="inline mr-2" size={16} />
                              {event.phone}
                            </p>
                          )}
                          {event.link && (
                            <p>
                              <LinkIcon className="inline mr-2" size={16} />
                              <a
                                href={event.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                Website
                              </a>
                            </p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>{event.frequency}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        event.cost.toLowerCase() === "free"
                          ? "secondary"
                          : "default"
                      }
                    >
                      {event.cost}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="text-gray-500 hover:text-gray-700" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p className="font-semibold mb-2">
                            Event Information:
                          </p>
                          <p>{event.info}</p>
                          {event.email && (
                            <p className="mt-2">
                              Contact:{" "}
                              <a
                                href={`mailto:${event.email}`}
                                className="text-blue-500 hover:underline"
                              >
                                {event.email}
                              </a>
                            </p>
                          )}
                          <p className="mt-2">
                            Event Type:{" "}
                            {event.event_type.charAt(0).toUpperCase() +
                              event.event_type.slice(1)}
                          </p>
                          {event.recurrence_rule && (
                            <p>Recurrence: {event.recurrence_rule}</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
