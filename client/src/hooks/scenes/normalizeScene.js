const UNDECIDED = "Undecided";

const STATUS_OPTIONS = ["Planning", "In Progress", "On Hold", "Completed"];

const normalizeText = (value) => {
  return typeof value === "string" ? value : "";
};

const normalizeOrder = (value) => {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue >= 0
    ? Number(parsedValue)
    : 0;
};

const normalizeCharacters = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  const characters = [
    ...new Set(
      value
        .filter((character) => typeof character === "number")
    ),
  ];

  if (characters.includes(-1) && characters.length > 1) {
    return characters.filter((character) => character !== -1);
  }

  return characters;
};

const normalizeLocation = (value) => {
  const location = normalizeText(value).trim();

  if (!location || location.toLowerCase() === "undefined") {
    return UNDECIDED;
  }

  return location;
};

const normalizeStatus = (value) => {
  return STATUS_OPTIONS.includes(value) ? value : "Planning";
};

const normalizeSceneValues = (values = {}) => {
  const scene = values && typeof values === "object" ? values : {};

  return {
    name: normalizeText(scene.name),
    description: normalizeText(scene.description),
    scene_order: normalizeOrder(scene.scene_order),
    timeline_order: normalizeOrder(scene.timeline_order),
    notes: normalizeText(scene.notes),
    location: normalizeLocation(scene.location),
    characters: normalizeCharacters(scene.characters),
    status: normalizeStatus(scene.status),
  };
};

export default normalizeSceneValues;