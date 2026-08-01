import OverviewCard from "../ui/OverviewCard";
import OverviewSection from "../ui/OverviewSection";
import { getLatestItems } from "../../utils/getLatestItems";

const normalizeCharacters = (characters) => {
  if (Array.isArray(characters)) {
    return characters.filter(
      (character) =>
        character && character.trim().toLowerCase() !== "undecided",
    );
  }

  if (
    typeof characters === "string" &&
    characters.trim() &&
    characters.trim().toLowerCase() !== "undecided"
  ) {
    return [characters.trim()];
  }

  return [];
};

const getSceneOrderText = (scene) => {
  const orderLabels = [];

  if (Number(scene.scene_order) > 0) {
    orderLabels.push(`Scene ${scene.scene_order}`);
  }

  if (Number(scene.timeline_order) > 0) {
    orderLabels.push(`Timeline ${scene.timeline_order}`);
  }

  return orderLabels.length > 0 ? orderLabels.join(" · ") : "Order not set";
};

const getLocationName = (location) => {
  if (typeof location !== "string") {
    return null;
  }

  const normalizedLocation = location.trim();

  if (
    !normalizedLocation ||
    normalizedLocation.toLowerCase() === "undefined" ||
    normalizedLocation.toLowerCase() === "undecided"
  ) {
    return null;
  }

  return normalizedLocation;
};

const SceneOverview = ({ projectId, scenes = [] }) => {
  const latestScenes = getLatestItems(scenes);
  const sceneLabel = scenes.length === 1 ? "scene" : "scenes";

  return (
    <OverviewSection
      eyebrow="Scenes"
      count={scenes.length}
      title="Recent scenes"
      description="Review the newest scenes added to this story."
      actionTo={`/projects/${projectId}/scenes/new`}
      actionLabel="Add scene"
      viewAllTo={`/projects/${projectId}/scenes`}
      viewAllLabel={`View all ${scenes.length} ${sceneLabel}`}
      emptyMessage="No scenes have been added yet. Add a scene to begin structuring the story."
      isEmpty={scenes.length === 0}
    >
      <div className="overview-grid">
        {latestScenes.map((scene) => {
          const characters = normalizeCharacters(scene.characters);

          const locationName = getLocationName(scene.location);

          const characterLabel =
            characters.length === 1 ? "character" : "characters";

          return (
            <OverviewCard
              key={scene.id}
              to={`/projects/${projectId}/scenes/${scene.id}`}
              title={scene.name}
              meta={scene.status || "Planning"}
              subheading={getSceneOrderText(scene)}
              description={scene.description}
              badges={[locationName, `${characters.length} ${characterLabel}`]}
              detailLabel="View scene"
            />
          );
        })}
      </div>
    </OverviewSection>
  );
};

export default SceneOverview;
