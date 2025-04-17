import { getServerSession } from "next-auth";
import EavTypesModule from "./Module";
import type { Metadata } from "next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export const metadata: Metadata = {
  title: "صدور کارت VIP",
};

async function getData(session) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/admin/vipBundleTypes`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    }
  );
  if (res.status === 404) {
    return notFound();
  }
  return res.json();
}

const EntityTypes = async () => {
  const session = await getServerSession(authOptions);
  const { result: bundleTypes } = await getData(session)

  return <EavTypesModule bundleType={bundleTypes} />;
};

export default EntityTypes;
