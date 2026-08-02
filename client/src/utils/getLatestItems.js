const getCreatedTimestamp = (item) => {
  const timestamp = new Date(item?.created_at).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export const getLatestItems = (items = [], limit = 2) => {
  if (!Array.isArray(items)) {
    return [];
  }

  return [...items]
    .sort(
      (firstItem, secondItem) =>
        getCreatedTimestamp(secondItem) - getCreatedTimestamp(firstItem),
    )
    .slice(0, limit);
};
