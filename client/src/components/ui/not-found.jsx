// src/components/ui/not-found.jsx
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export const NotFoundState = ({ title = "Not Found", description = "The item you're looking for doesn't exist." }) => (
  <article className="center-box">
    <MagnifyingGlassIcon style={{ width: '48px', color: 'var(--muted-color)' }} />
    <h3>{title}</h3>
    <p>{description}</p>
  </article>
);