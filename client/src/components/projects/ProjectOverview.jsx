import OverviewSection from "../ui/OverviewSection";

const ProjectOverview = ({ scenes = [], characters = [], locations = [] }) => {
  const completedScenes = scenes.filter(
    (scene) =>
      String(scene.status || "")
        .trim()
        .toLowerCase() === "completed",
  ).length;

  const progress =
    scenes.length > 0 ? Math.round((completedScenes / scenes.length) * 100) : 0;

  const statistics = [
    {
      label: "Scenes",
      value: scenes.length,
    },
    {
      label: "Characters",
      value: characters.length,
    },
    {
      label: "Locations",
      value: locations.length,
    },
    {
      label: "Scene progress",
      value: `${progress}%`,
    },
  ];

  return (
    <OverviewSection
      eyebrow="Story snapshot"
      title="Project progress"
      description="See how much of this story workspace has been developed."
    >
      <dl className="overview-stats">
        {statistics.map((statistic) => (
          <div key={statistic.label} className="overview-stat">
            <dt>{statistic.label}</dt>
            <dd>{statistic.value}</dd>
          </div>
        ))}
      </dl>

      <div className="overview-progress">
        <div className="overview-progress__heading">
          <span>Completed scenes</span>

          <strong>
            {completedScenes} of {scenes.length}
          </strong>
        </div>

        <div
          className="overview-progress__track"
          role="progressbar"
          aria-label="Completed scenes"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={progress}
        >
          <span
            className="overview-progress__fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </OverviewSection>
  );
};

export default ProjectOverview;
