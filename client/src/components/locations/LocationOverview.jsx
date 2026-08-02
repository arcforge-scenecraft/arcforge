import OverviewCard from "../ui/OverviewCard";
import OverviewSection from "../ui/OverviewSection";
import { getLatestItems } from "../../utils/getLatestItems";

const LocationOverview = ({ projectId, locations = [] }) => {
  const latestLocations = getLatestItems(locations);
  const locationLabel = locations.length === 1 ? "location" : "locations";

  return (
    <OverviewSection
      eyebrow="Locations"
      count={locations.length}
      title="Recent locations"
      description="Review the newest settings created for this story."
      actionTo={`/projects/${projectId}/locations/new`}
      actionLabel="Add location"
      viewAllTo={`/projects/${projectId}/locations`}
      viewAllLabel={`View all ${locations.length} ${locationLabel}`}
      emptyMessage="No locations have been added yet. Add a location to begin building the story world."
      isEmpty={locations.length === 0}
    >
      <div className="overview-grid">
        {latestLocations.map((location) => (
          <OverviewCard
            key={location.id}
            to={`/projects/${projectId}/locations/${location.id}`}
            title={location.name}
            description={location.description}
            badges={[
              location.atmosphere ? `Atmosphere: ${location.atmosphere}` : null,
            ]}
            detailLabel="View location"
          />
        ))}
      </div>
    </OverviewSection>
  );
};

export default LocationOverview;
