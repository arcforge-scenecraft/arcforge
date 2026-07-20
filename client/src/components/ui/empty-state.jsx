// src/components/ui/empty-state.jsx
import { InboxIcon } from "@heroicons/react/24/outline";

export const EmptyState = ({ title, description, action }) => (
  <article className="center-box">
    <InboxIcon style={{ width: '48px', color: 'var(--muted-color)' }} />
    <hgroup>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </hgroup>
    {action && <button onClick={action.onClick} className="secondary">{action.label}</button>}
  </article>
);