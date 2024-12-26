import axios from "axios";

type Event = {
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
  console.log(process.env.NEXT_PUBLIC_API_URL);
  console.log("hi");
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/events?city=${city}`
  );
  console.log(response);
  return response.data;
}
