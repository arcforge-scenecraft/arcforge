import SceneCard from "./SceneCard";

const SceneList = ({ scenes, projectId, onDeleteScene }) => {
  return (
    <div className="collection-grid">
      {scenes.map((scene) => (
        <SceneCard
          key={scene.id}
          scene={scene}
          projectId={projectId}
          onDelete={() => onDeleteScene(scene.id)}
        />
      ))}
    </div>
  );
};

export default SceneList;
