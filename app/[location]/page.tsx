import { Map } from "@/app/components/map";
import { getEvents } from "@/app/services/events";

export default async function LocationPage({
  params,
}: {
  params: { location: string };
}) {
  const location = params.location.replace(/-/g, " ");
  const decodedLocation = decodeURIComponent(location);
  const [city, country] = decodedLocation.split(",").map((part) => part.trim());

  const events = await getEvents(city);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Open Mic Events in {city}</h1>
      <Map city={city} country={country || "United States"} events={events} />
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
        {events.length > 0 ? (
          <div className="grid gap-4">
            {events.map((event) => (
              <div key={event.id} className="border p-4 rounded-lg">
                <h3 className="font-semibold">{event.name}</h3>
                <p>{event.venue}</p>
                <p>{event.time}</p>
                <p>{event.address}</p>
                <p>{event.info}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>
            No events scheduled at the moment. Check back later or be the first
            to post an event!
          </p>
        )}
      </div>
    </div>
  );
}
