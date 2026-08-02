import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export const CollectionToolbar = ({
  resourceName,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  sortValue,
  onSortChange,
  sortOptions,
  filterLabel,
  filterValue,
  onFilterChange,
  filterOptions = [],
  visibleCount,
  totalCount,
}) => {
  return (
    <section
      className="collection-toolbar"
      aria-label={`${resourceName} controls`}
    >
      <div className="collection-toolbar__controls">
        <label className="collection-toolbar__search">
          <span className="collection-toolbar__label">Search</span>

          <span className="collection-toolbar__input-wrap">
            <MagnifyingGlassIcon aria-hidden="true" />

            <input
              type="search"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
            />
          </span>
        </label>

        {filterOptions.length > 0 && (
          <label className="collection-toolbar__field">
            <span className="collection-toolbar__label">{filterLabel}</span>

            <span className="collection-toolbar__select-wrap">
              <FunnelIcon aria-hidden="true" />

              <select
                value={filterValue}
                onChange={(event) => onFilterChange(event.target.value)}
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </span>
          </label>
        )}

        <label className="collection-toolbar__field">
          <span className="collection-toolbar__label">Sort by</span>

          <select
            value={sortValue}
            onChange={(event) => onSortChange(event.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="collection-toolbar__summary" aria-live="polite">
        Showing <strong>{visibleCount}</strong> of <strong>{totalCount}</strong>{" "}
        {resourceName}
      </p>
    </section>
  );
};
