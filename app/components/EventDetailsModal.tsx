"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Event } from "@/types/event";
import { MapPin, Phone, Mail, Link as LinkIcon, Calendar } from "lucide-react";
import { format } from "date-fns";

interface EventDetailsModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | undefined;
}

export function EventDetailsModal({
  event,
  isOpen,
  onClose,
  selectedDate,
}: EventDetailsModalProps) {
  if (event.info) {
    event.info = event.info.replace(/\\n/g, "\n");
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{event.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
            <MapPin className="w-5 h-5" />
            <div>
              <p className="font-medium">{event.venue}</p>
              <p className="text-sm text-muted-foreground">
                {event.address}, {event.city}, {event.state}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
            <Calendar className="w-5 h-5" />
            <div>
              <p className="font-medium">Event Details</p>
              <p className="text-sm text-muted-foreground">
                {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Date"}{" "}
                at {event.time}
              </p>
              <p className="text-sm text-muted-foreground">
                Frequency: {event.frequency || "One-time event"}
              </p>
            </div>
          </div>

          {event.info && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Additional Information</h4>
              <p className="text-sm text-muted-foreground">{event.info}</p>
            </div>
          )}

          <div className="space-y-2">
            {event.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a
                  href={`tel:${event.phone}`}
                  className="text-sm hover:underline"
                >
                  {event.phone}
                </a>
              </div>
            )}
            {event.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a
                  href={`mailto:${event.email}`}
                  className="text-sm hover:underline"
                >
                  {event.email}
                </a>
              </div>
            )}
            {event.link && (
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline"
                >
                  Visit Website
                </a>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
