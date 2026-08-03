import { useState } from "react";

const Popup = ({
    type,
    projectId,
    sceneId,
    isEditing,
    isSubmitting,
    isDeleting,
    data,
    onAdd,
    onUpdate,
    onEdit,
    onCancel,
    onDelete,
    options,
    onChange,
    onSpecialtyChange,
    formData,
}) => {
    const [eyebrow, setEyebrow] = useState(null);
    const [heading, setHeading] = useState(null);
    const dataKnown = data.id != -1;

    if (isEditing) {
        setHeading(`Select ${type}`)
        if (dataKnown) {
            setEyebrow(`Edit ${type}`);
        } else {
            setEyebrow(`Add ${type}`);
        }
    } else {
        setEyebrow(type)
        setHeading(data.name)
    }

    return (
        <div
            className="popup__overlay"
            onClick={onCancel}
        >
            <div
                className="popup"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="popup__close"
                    onClick={onCancel}
                >
                    ×
                </button>

                <div className="detail__section-heading">
                    <p className="detail__eyebrow">{eyebrow}</p>
                    <h2>{heading}</h2>
                </div>

                {type == "character" && data.description ? <p>{data.description}</p> : ""}

                <form onSubmit={data.id != -1 ? onEdit : onAdd}>
                    {!isEditing ? (
                        <fieldset className="form-fields">
                            <label></label>

                            {type == location ?
                                <div className="form-field">
                                    <label>Description</label>

                                    <p>{data.description || "No description listed."}</p>

                                    <label>Atmosphere</label>

                                    <p>{data.atmosphere || "No atmosphere listed."}</p>
                                </div> :
                                <>
                                    <div className="form-field">
                                        <label>Role in Scene</label>

                                        <input
                                            value={data.role_in_scene || "No role has been added."}
                                            readOnly
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label>Knowledge Gained</label>

                                        <textarea
                                            value={data.knowledge_gained ||
                                                "Nothing recorded."}
                                            rows="6"
                                            readOnly
                                        />
                                    </div>
                                </>
                            }

                            <div className="popup__actions">
                                <button className="detail__edit-link"
                                    onClick={onEdit}
                                >
                                    <PencilSquareIcon />
                                    Edit
                                </button>

                                <Link to={`/projects/${projectId}/${type == "character"
                                    ? `characters` : `locations`}
                                    /${data.id}`} className="secondary-button">
                                    Explore
                                </Link>

                                <button className="delete__button"
                                    onClick={onDelete}
                                    disabled={isDeleting}
                                    aria-busy={isDeleting}
                                >
                                    <TrashIcon className="delete__icon" aria-hidden="true" />
                                    <span>{isDeleting ? "Removing..." : "Remove from scene"}</span>
                                </button>
                            </div>
                        </fieldset>
                    ) : (
                        <fieldset className="form-fields" disabled={isSubmitting}>
                            <label></label>

                            {!dataKnown &&
                                <>
                                    <div className="genre-options">
                                        {options.map((option) => {
                                            const isSelected = formData.id == option.id;

                                            return (
                                                <label
                                                    key={option.id}
                                                    className={`genre-option ${isSelected ? "genre-option-selected" : ""}`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        name="character_id"
                                                        value={option.id}
                                                        checked={isSelected}
                                                        onChange={onSpecialtyChange}
                                                    />

                                                    <span className="genre-option-content">
                                                        <span className="genre-checkmark" aria-hidden="true">
                                                            {isSelected ? "✓" : ""}
                                                        </span>

                                                        {option.name}
                                                    </span>
                                                </label>
                                            )
                                        }
                                        )}
                                    </div>

                                    {type == "location" && formData.id && formData.id != "" &&
                                        < MiniCard
                                            heading={formData.name}
                                            fields={["Description", "Atmosphere"]}
                                            data={formData}
                                        />
                                    }

                                    {type == "character" && formData.id && formData.id != "" &&
                                        < MiniCard
                                            heading={`${formData.name} | ${formData.story_role}`}
                                            fields={["Description", "goal"]}
                                            data={formData}
                                        />
                                    }
                                </>
                            }

                            {type == "character" &&
                                <>
                                    <div className="form-field">
                                        <label>Role</label>
                                        <input
                                            id="role_in_scene"
                                            name="role_in_scene"
                                            type="text"
                                            value={formData.role_in_scene || ""}
                                            maxLength={255}
                                            onChange={onChange}
                                            placeholder="Enter the character's scene role (eg. protagonist, mentor, rival)"
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label>Knowledge Gained</label>
                                        <textarea
                                            id="knowledge_gained"
                                            name="knowledge_gained"
                                            rows="6"
                                            value={formData.knowledge_gained || ""}
                                            onChange={onCancel}
                                            placeholder="What does the character learn in this scene, if anything?"
                                        />
                                    </div>
                                </>
                            }

                            <div className="popup__actions">
                                <button className="detail__edit-link"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {data.id != -1 ? (isSubmitting ? "Saving..." : "Save") : (isSubmitting ? "Adding..." : "Add")}
                                </button>

                                <button className="secondary-button"
                                    onClick={() => {onCancel}}
                                >
                                    Cancel
                                </button>
                            </div>
                        </fieldset>
                    )}
                </form>

            </div>
        </div>
    );
}

export default Popup;