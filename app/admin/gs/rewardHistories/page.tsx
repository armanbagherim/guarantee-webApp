import RewardHistoriesModule from "./Module";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "گزارش تاریخچه پاداش",
};

const RewardHistoriesPage = () => {
  return <RewardHistoriesModule />;
};

export default RewardHistoriesPage;
