import { InboxIcon } from "@heroicons/react/24/outline";
import { StateLayout } from "./StateLayout";

export const EmptyState = ({
  title = "Nothing here yet",
  description,
  action,
}) => {
  return (
    <StateLayout
      variant="empty"
      icon={<InboxIcon />}
      title={title}
      description={description}
      action={action}
    />
  );
};
