"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import "../../styles/calendar.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const today = new Date();
  const in30Days = new Date();
  in30Days.setDate(today.getDate() + 90);
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      disabled={{
        before: today,
        after: in30Days,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
