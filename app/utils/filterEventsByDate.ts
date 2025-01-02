import { Event } from "@/types/event";
import { isSameDay } from "date-fns";
import { RRule } from "rrule";

export function filterEventsByDate(
  events: Event[],
  selectedDate: Date
): Event[] {
  return events.filter((event) => {
    // For singular events, just compare the dates
    if (event.event_type === "singular") {
      return isSameDay(new Date(event.date), selectedDate);
    }

    // For recurring events with a recurrence rule
    if (event.event_type === "recurring" && event.recurrence_rule) {
      try {
        const rrule = RRule.fromString(event.recurrence_rule);
        const occurrences = rrule.between(
          new Date(event.date),
          new Date(new Date().setDate(new Date().getDate() + 91)),
          true
        );
        return occurrences.some((date) => isSameDay(date, selectedDate));
      } catch (error) {
        console.error(`Invalid recurrence rule for event ${event.id}:`, error);
        return false;
      }
    }

    return false;
  });
}
