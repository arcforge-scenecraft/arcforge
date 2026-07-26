import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { StateLayout } from "./StateLayout";

export const Loader = ({ text = "Loading..." }) => {
  return (
    <StateLayout
      variant="loading"
      role="status"
      icon={<ArrowPathIcon className="ui-state__spinner" />}
      description={text}
    />
  );
};
