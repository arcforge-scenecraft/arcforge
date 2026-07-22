import LocationCard from "./LocationCard";

function LocationList({ locations, projectId }) {
  return (
    <div className="detail-grid">
      {locations.map((location) => (
        <LocationCard
          key={location.id}
          location={location}
          projectId={projectId}
        />
      ))}
    </div>
  );
}

export default LocationList;
