import EavTypesModule from "./Module";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "نظرسنجی",
};

const EntityTypes = () => {
  return <EavTypesModule />;
};

export default EntityTypes;
