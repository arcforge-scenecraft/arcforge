const ProjectFormHeader = ({ eyebrow, title, description }) => {
  return (
    <header className="form-header">
      <div className="form-header__content">
        <p className="form-header__eyebrow">{eyebrow}</p>

        <h1 className="form-header__title">{title}</h1>

        <p className="form-header__description">{description}</p>
      </div>
    </header>
  );
};

export default ProjectFormHeader;
