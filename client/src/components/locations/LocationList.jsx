import LocationCard from "./LocationCard";

function LocationList({ locations, projectId, onDeleteLocation }) {
  return (
    <div className="detail-grid">
      {locations.map((location) => (
        <LocationCard
          key={location.id}
          location={location}
          projectId={projectId}
          onDelete={() => onDeleteLocation(location.id)}
        />
      ))}
    </div>
  );
}

export default LocationList;
