import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import SignInForm from "./components/BaseForm";
import NextAuth from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import type { Session } from "next-auth";
import { Metadata } from "next";
import { ISession } from "../interfaces/ISession";

export const metadata: Metadata = {
  title: "کلاب آریا کیش | ورود",
  description: "ورود به کلاب آریا کیش",
};
const LoginPage = async () => {
  const session: ISession | null = await getServerSession(authOptions);

  if (session?.token) {
    return redirect("/");
  }
  return <SignInForm session={session} />;
};

export default LoginPage;
