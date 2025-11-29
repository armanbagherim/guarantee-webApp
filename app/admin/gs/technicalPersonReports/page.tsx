import SupplierReportsModule from "./Module";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "گزارشات افراد فنی",
};

const EntityTypes = () => {
  return <SupplierReportsModule />;
};

export default EntityTypes;
