import EavTypesModule from "./Module";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "کارت گارانتی های عادی",
};

const EntityTypes = () => {
  return <EavTypesModule />;
};

export default EntityTypes;
