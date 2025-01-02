import axios from "axios";
import { Event } from "@/types/event";

export type { Event };

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
