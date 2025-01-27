import { Event } from "@/types/event";
import { isSameDay } from "date-fns";
import { RRule } from "rrule";

export function filterEventsByDate(
  events: Event[],
  selectedDate: Date
): Event[] {
  return events.filter((event) => {
    // Remove any spaces from the recurrence rule string
    if (event.recurrence_rule) {
      event.recurrence_rule = event.recurrence_rule.replace(/\s+/g, "");
    }
    // For singular events, just compare the dates
    if (event.event_type === "singular") {
      return isSameDay(new Date(event.date), selectedDate);
    }

    // For recurring events with a recurrence rule
    if (event.event_type === "recurring" && event.recurrence_rule) {
      try {
        console.log(new Date(event.date));
        const rrule = RRule.fromString(event.recurrence_rule);
        const occurrences = rrule.between(
          new Date(new Date().setDate(new Date().getDate() - 1)),
          new Date(new Date().setDate(new Date().getDate() + 91)),
          true
        );
        console.log(occurrences);

        return occurrences.some((date) => {
          return isSameDay(date, selectedDate);
        });
      } catch (error) {
        console.error(`Invalid recurrence rule for event ${event.id}:`, error);
        console.log(event);
        return false;
      }
    }

    return false;
  });
}
