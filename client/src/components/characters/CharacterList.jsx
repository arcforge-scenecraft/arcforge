import CharacterCard from "./CharacterCard";

function CharacterList({ characters, projectId }) {
  return (
    <div className="detail-grid">
      {characters.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
          projectId={projectId}
        />
      ))}
    </div>
  );
}

export default CharacterList;
