import OverviewCard from "../ui/OverviewCard";
import OverviewSection from "../ui/OverviewSection";
import { getLatestItems } from "../../utils/getLatestItems";

const CharacterOverview = ({ projectId, characters = [] }) => {
  const latestCharacters = getLatestItems(characters);
  const characterLabel = characters.length === 1 ? "character" : "characters";

  return (
    <OverviewSection
      eyebrow="Characters"
      count={characters.length}
      title="Recent characters"
      description="Review the newest characters created for this story."
      actionTo={`/projects/${projectId}/characters/new`}
      actionLabel="Add character"
      viewAllTo={`/projects/${projectId}/characters`}
      viewAllLabel={`View all ${characters.length} ${characterLabel}`}
      emptyMessage="No characters have been added yet. Add a character to begin building the cast."
      isEmpty={characters.length === 0}
    >
      <div className="overview-grid">
        {latestCharacters.map((character) => (
          <OverviewCard
            key={character.id}
            to={`/projects/${projectId}/characters/${character.id}`}
            title={character.name}
            meta={character.story_role || "Role not specified"}
            description={character.description}
            footerText={character.goal ? `Goal: ${character.goal}` : null}
            detailLabel="View character"
          />
        ))}
      </div>
    </OverviewSection>
  );
};

export default CharacterOverview;
