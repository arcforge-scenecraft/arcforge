import SceneCard from "./SceneCard";

const SceneList = ({ scenes, onDeleteScene }) => {
  return (
    <div className="collection-grid">
      {scenes.map((scene) => (
        <SceneCard
          key={scene.id}
          scene={scene}
          onDelete={() => onDeleteScene(scene.id)}
        />
      ))}
    </div>
  );
};

export default SceneList;
