import { getServerSession } from "next-auth";
import EavTypesModule from "./Module";
import type { Metadata } from "next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export const metadata: Metadata = {
  title: "پیگیری درخواست",
};

const EntityTypes = async ({ searchParams }) => {
  const session = await getServerSession(authOptions)
  console.log(searchParams)
  const awaited = await searchParams
  return <EavTypesModule session={session} searchParams={awaited} />;
};

export default EntityTypes;
