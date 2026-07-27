const ProjectOverview = ({ project, status, genres }) => {
  return (
    <section className="detail__overview">
      <div className="detail__section-heading">
        <p className="detail__eyebrow">Project overview</p>

        <h2>About this story</h2>

        <p>
          Review the project’s core information before developing its scenes,
          characters, locations, and story details.
        </p>
      </div>

      <dl className="detail__information-list">
        <div className="detail__information-row">
          <dt>Project title</dt>
          <dd>{project.title}</dd>
        </div>

        <div className="detail__information-row">
          <dt>Status</dt>
          <dd>{status}</dd>
        </div>

        <div className="detail__information-row">
          <dt>Genre</dt>
          <dd>
            {genres.length > 0 ? genres.join(", ") : "Genre undecided"}
          </dd>
        </div>

        <div className="detail__information-row">
          <dt>Description</dt>
          <dd>
            {project.description ||
              "No project description has been added yet."}
          </dd>
        </div>
      </dl>
    </section>
  );
};

export default ProjectOverview;
