// import { ArrowLeftIcon } from "@heroicons/react/24/outline";
// import { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import SceneCard from "../../components/scenes/SceneCard";
// import ProjectFormHeader from "../../components/projects/ProjectFormHeader";
// import { ErrorState, Loader } from "../../components/ui";
// import { deleteScene } from "../../services/sceneApi";
// import useScene from "../../hooks/scenes/useScene";

// const SceneDetail = () => {
//     const {projectId, sceneId } = useParams();
//     const navigate = useNavigate();

//     const { 
//         scene,
//         loading,
//         error,
//         notFound,
//         retry
//     } = useScene( projectId, sceneId);

//     const handleDeleteScene = async () => {
//         await deleteScene(projectId, sceneId);
    
//         navigate(`/projects/${projectId}/scenes`, {
//           replace: true,
//         });
//     };

//     if (loading) {
//         return (
//             <main className="detail-page">
//             <section className="detail">
//                 <Link to="/dashboard" className="detail__back-link">
//                 <ArrowLeftIcon aria-hidden="true" />
//                 Back to dashboard
//                 </Link>

//                 <div className="detail__state">
//                 <Loader text="Loading scene details..." />
//                 </div>
//             </section>
//             </main>
//         );
//     }

//     if (notFound) {
//         return <NotFound />;
//     }

//     if (error) {
//         return (
//             <main className="detail-page">
//             <section className="detail">
//                 <Link
//                 to={`/projects/${projectId}/scenes`}
//                 className="detail__back-link"
//                 >
//                 <ArrowLeftIcon aria-hidden="true" />
//                 Back to scenes
//                 </Link>

//                 <header className="detail__error-header">
//                 <p className="detail__eyebrow">Scene workspace</p>

//                 <h1>Unable to open scene</h1>

//                 <p>We could not retrieve the selected scene.</p>
//                 </header>

//                 <div className="detail__state">
//                 <ErrorState message={error} onRetry={retry} />
//                 </div>
//             </section>
//             </main>
//         );
//     }

//     return (
//     <main className="page-container">
//         <Link
//         to={`/projects/${projectId}/scenes`}
//         className="detail__back-link"
//         >
//         <ArrowLeftIcon aria-hidden="true" />
//         Back to scenes
//         </Link>

//         <ProjectFormHeader
//         eyebrow="Scene details"
//         title={`${scene.name}`}
//         description={`${scene.description}`}
//         />

//         <header className="page-header">
//         <p className="eyebrow">Scene details</p>

//         <h1 className="page-title">{scene.name}</h1>
//         </header>

//         <section className="detail-panel">
//         <SceneCard 
//         key={scene.id}
//         scene={scene}
//         onDelete={handleDeleteScene}
//         />
//         </section>

//         {/* <div className="page-actions">
//         <Link
//             to={`/projects/${projectId}/locations/${locationId}/edit`}
//             className="button button--primary"
//         >
//             Edit location
//         </Link>

//         <Link
//             to={`/projects/${projectId}`}
//             className="button button--secondary"
//         >
//             Back to project
//         </Link>

//         <Link
//             to={`/projects/${projectId}/locations`}
//             className="button button--secondary"
//         >
//             View all locations
//         </Link>

//         <LocationDeleteButton
//             locationName={location.name}
//             onDelete={handleDeleteLocation}
//         />
//         </div> */}
//     </main>
//     );
// }

// export default SceneDetail;

import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  PencilSquareIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate, useParams } from "react-router-dom";

import SceneDeleteButton from "../../components/scenes/SceneDeleteButton";
import { ErrorState, Loader } from "../../components/ui";
import useScene from "../../hooks/scenes/useScene";
import { deleteScene } from "../../services/sceneApi";

const formatDate = (value) => {
  if (!value) return "Not available";

  const date = new Date(value);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const SceneDetail = () => {
  const { projectId, sceneId } = useParams();
  const navigate = useNavigate();

  const {
    scene,
    loading,
    error,
    retry,
  } = useScene(projectId, sceneId);

  const handleDeleteScene = async () => {
    await deleteScene(projectId, scene.id);

    navigate(`/projects/${projectId}/scenes`, {
      replace: true,
      state: {
        message: `"${scene.name}" was deleted successfully.`,
      },
    });
  };

  if (loading) {
    return (
      <main className="detail-page">
        <section className="detail">
          <Link
            to={`/projects/${projectId}/scenes`}
            className="detail__back-link"
          >
            <ArrowLeftIcon />
            Back to scenes
          </Link>

          <div className="detail__state">
            <Loader text="Loading scene..." />
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="detail-page">
        <section className="detail">
          <Link
            to={`/projects/${projectId}/scenes`}
            className="detail__back-link"
          >
            <ArrowLeftIcon />
            Back to scenes
          </Link>

          <header className="detail__error-header">
            <p className="detail__eyebrow">Scene</p>
            <h1>Unable to open scene</h1>
          </header>

          <div className="detail__state">
            <ErrorState message={error} onRetry={retry} />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="detail-page">
      <article className="detail">

        <Link
          to={`/projects/${projectId}/scenes`}
          className="detail__back-link"
        >
          <ArrowLeftIcon />
          Back to scenes
        </Link>

        <header className="detail__hero">
          <div className="detail__hero-content">

            <div className="detail__heading-row">
              <p className="detail__eyebrow">Scene Workspace</p>

              <span className="detail__status">
                {scene.status}
              </span>
            </div>

            <h1>{scene.name}</h1>

            <p className="detail__description">
              {scene.description ||
                "No scene description has been added."}
            </p>

          </div>

          <div className="detail__actions">

            <Link
              to={`/projects/${projectId}/scenes/${scene.id}/edit`}
              className="detail__edit-link"
            >
              <PencilSquareIcon />
              Edit scene
            </Link>

            <SceneDeleteButton
              sceneName={scene.name}
              onDelete={handleDeleteScene}
            />

          </div>
        </header>

        <section className="detail__metadata">
          <article className="detail__metadata-card">
            <div className="detail__metadata-icon">
              <PencilSquareIcon />
            </div>

            <div>
              <span className="detail__metadata-label">
                Status
              </span>

              <strong className="detail__metadata-value">
                {scene.status}
              </strong>
            </div>
          </article>

          <article className="detail__metadata-card">
            <div className="detail__metadata-icon">
              <CalendarDaysIcon />
            </div>

            <div>
              <span className="detail__metadata-label">
                Created
              </span>

              <strong className="detail__metadata-value">
                {formatDate(scene.created_at)}
              </strong>
            </div>
          </article>

          <article className="detail__metadata-card">
            <div className="detail__metadata-icon">
              <ClockIcon />
            </div>

            <div>
              <span className="detail__metadata-label">
                Last Updated
              </span>

              <strong className="detail__metadata-value">
                {formatDate(scene.updated_at)}
              </strong>
            </div>
          </article>
        </section>

        <section className="detail__overview">
            <div className="detail__section-heading">
                <p className="detail__eyebrow">Overview</p>

                <h2>About this scene</h2>

                <p>
                Review the scene's core information before, during, and after development.
                </p>
            </div>

            <dl className="detail__information-list">
                <div className="detail__information-row">
                    <dt>Location</dt>
                    <dd className="detail__genres">
                      <span className={scene.location && scene.location != "Undecided"?"detail__genre":""}>{scene.location ||"Undecided"}</span>
                    </dd>
                </div>
                <div className="detail__information-row">
                    <dt>Characters</dt>
                    <dd className="detail__genres">
                        {scene.characters?.length ? (
                        scene.characters.map(character => (
                            <span
                            key={character}
                            className={character != "Undecided"?"detail__genre":""}
                            >
                            {character}
                            </span>
                        ))
                        ) : (
                        <span className="detail__metadata-value">
                            No characters
                        </span>
                        )}
                    </dd>
                </div>

                <div className="detail__information-row">
                    <dt>Scene Order</dt>
                    <dd>#{scene.scene_order}</dd>
                </div>

                <div className="detail__information-row">
                    <dt>Timeline Order</dt>
                    <dd>#{scene.timeline_order}</dd>
                </div>
            </dl>
        </section>

        <section className="detail__overview-single">
            <div className="detail__section-heading">
                <p className="detail__eyebrow">Elements</p>
                <h2>Location & Characters</h2>
            </div>

            {scene.characters === ["Undecided"]?<div className="detail__related-grid">
                {/* <Link
                to={`/projects/${projectId}/locations/${scene.location}`}
                className="detail__related-card"
                > */}
                {scene.location && scene.location != "Undecided"?
                <div className="detail__related-card">
                    <MapPinIcon className="detail__related-icon" />

                    <span className="detail__related-label">Location</span>

                    <strong className="detail__related-title">
                        {scene.location}
                    </strong>
                </div>: ""
                }
                {/* </Link> */}

                {scene.characters != ["Undecided"]?.map((character) => (
                // <Link
                //     key={character.id}
                //     to={`/projects/${projectId}/characters/${character.id}`}
                //     className="detail__related-card"
                // >
                <div className="detail__related-card">
                    <UserGroupIcon className="detail__related-icon" />

                    <span className="detail__related-label">Character</span>

                    <strong className="detail__related-title">
                    {character}
                    </strong>
                </div>
                // </Link> 
                ))}
            </div>: <span className="detail__metadata-value">No characters or locations have been selected for this scene.</span>}
        </section>

        <section className="detail__overview-single">
            <div className="detail__section-heading">
                <p className="detail__eyebrow">Planning</p>

                <h2>Creator's Notes</h2>

                {/* <p>{scene.notes}</p> */}
                <textarea
                className="detail__notes"
                value={scene.notes || "No notes have been added for this scene."}
                readOnly
                rows={6}
                style={{ height: "auto"}}
                ref={(el) => {
                    if (el) {
                    el.style.height = "auto";
                    el.style.height = `${el.scrollHeight}px`;
                    }
                }}
                />
            </div>
         </section>

      </article>
    </main>
  );
};

export default SceneDetail;