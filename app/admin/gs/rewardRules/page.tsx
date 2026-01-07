import RewardRulesModule from "./Module";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "قوانین پاداش",
};

const RewardRulesPage = () => {
  return <RewardRulesModule />;
};

export default RewardRulesPage;
