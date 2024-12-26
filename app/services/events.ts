import axios from "axios";

export type Event = {
  id: string;
  time: string;
  name: string;
  venue: string;
  address: string;
  city: string;
  state: string;
  date: string;
  event_type: "singular" | "recurring";
  recurrence_rule?: string;
  info?: string;
};

export async function getEvents(city: string): Promise<Event[]> {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/events?city=${city}`;
    console.log("Requesting URL:", url);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}
