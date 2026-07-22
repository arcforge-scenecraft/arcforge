import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { StateLayout } from "./StateLayout";

export const NotFoundState = ({
  title = "Not Found",
  description = "The item you're looking for doesn't exist.",
  action,
}) => {
  return (
    <StateLayout
      variant="not-found"
      icon={<MagnifyingGlassIcon />}
      title={title}
      description={description}
      action={action}
    />
  );
};
