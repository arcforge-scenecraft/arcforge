const ProjectFormHeader = ({ eyebrow, title, description }) => {
  return (
    <header className="project-form-header">
      <div className="project-form-header__content">
        <p className="project-form-header__eyebrow">{eyebrow}</p>

        <h1 className="project-form-header__title">{title}</h1>

        <p className="project-form-header__description">{description}</p>
      </div>
    </header>
  );
};

export default ProjectFormHeader;
