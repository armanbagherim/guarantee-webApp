import { getServerSession } from "next-auth";
import EavTypesModule from "./Module";
import type { Metadata } from "next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export const metadata: Metadata = {
  title: "گزارشات درامدی",
};

const EntityTypes = async () => {
  const session = await getServerSession(authOptions)
  return <EavTypesModule session={session} />;
};

export default EntityTypes;
