import { Map } from "@/components/map";

export default function LocationPage({
  params,
}: {
  params: { location: string };
}) {
  const location = params.location.replace(/-/g, " ");
  const [city, country] = location.split(",").map((part) => part.trim());

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Open Mic Events in {city}</h1>
      <Map city={city} country={country || "United States"} />
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
        <p>
          No events scheduled at the moment. Check back later or be the first to
          post an event!
        </p>
      </div>
    </div>
  );
}
