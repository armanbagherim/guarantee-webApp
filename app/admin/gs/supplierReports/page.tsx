import SupplierReportsModule from "./Module";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "گزارشات تامین کنندگان",
};

const EntityTypes = () => {
  return <SupplierReportsModule />;
};

export default EntityTypes;
