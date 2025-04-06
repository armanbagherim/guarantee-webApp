import EavTypesModule from "./Module";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "انواع کارت های گارانتی",
};

const EntityTypes = () => {
  return <EavTypesModule />;
};

export default EntityTypes;
