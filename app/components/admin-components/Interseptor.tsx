"use server";

import { cookies } from "next/headers";

export default async function Interseptor(url, session) {
  const cookieStore = cookies();

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${url}`, {
    cache: "no-store",
    headers: {
      "x-session-id": cookieStore.get("SessionName")?.value,
      Authorization: `Bearer ${session?.token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res;
}
