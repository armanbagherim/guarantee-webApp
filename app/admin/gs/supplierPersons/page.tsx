import EavTypesModule from "./Module";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تامین کنندگان ",
};

const EntityTypes = () => {
  return <EavTypesModule />;
};

export default EntityTypes;
