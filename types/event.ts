export interface Event {
  id: string;
  time: string;
  name: string | null;
  venue: string | null;
  address: string;
  city: string;
  state: string;
  frequency: string | null;
  cost: string | null;
  info: string | null;
  email: string | null;
  link: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  date: Date;
  event_type: "singular" | "recurring";
  recurrence_rule: string | null;
  recurrence_end_date: Date | null;
  created_at: Date;
  updated_at: Date;
}
