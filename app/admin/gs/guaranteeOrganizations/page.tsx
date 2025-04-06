import EavTypesModule from "./Module";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "نمایندگان",
};

const EntityTypes = () => {
  return <EavTypesModule />;
};

export default EntityTypes;
