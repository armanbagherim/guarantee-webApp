import EavTypesModule from "./Module";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سوالات متداول",
};

const EntityTypes = () => {
  return <EavTypesModule />;
};

export default EntityTypes;
