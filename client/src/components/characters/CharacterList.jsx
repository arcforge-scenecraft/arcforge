import CharacterCard from "./CharacterCard";

function CharacterList({ characters, projectId, onDeleteCharacter }) {
  return (
    <div className="detail-grid">
      {characters.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
          projectId={projectId}
          onDelete={() => onDeleteCharacter(character.id)}
        />
      ))}
    </div>
  );
}

export default CharacterList;
