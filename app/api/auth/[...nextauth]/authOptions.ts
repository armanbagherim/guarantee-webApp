import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phoneNumber: {
          label: "phoneNumber",
          type: "text",
          placeholder: "jsmith",
        },
      },
      async authorize(credentials, req) {
        const { phoneNumber, verifyCode, firstName, lastName, nationalCode } = credentials;
        let res;

        if (phoneNumber && !verifyCode) {
          try {
            res = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/client/login`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  phoneNumber,
                }),
              }
            );
          } catch (error) {
            throw Error(error);
          }
        } else if (verifyCode) {
          res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/client/login/verifyCode`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                code: verifyCode,
                firstname: firstName || "",
                lastname: lastName || "",
                // nationalCode: nationalCode || "",
                phoneNumber,
              }),
            }
          );
          if (res.status === 400) {
            console.log(res);
            throw new Error("! کد تایید معتبر نیست");
          }
        }
        //
        const user = await res.json();
        if (res.ok && user) {
          return user;
        } else if (res.status === 400) {
          return null;
        } else {
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...token, ...session };
      }
      return { ...token, ...user };
    },

    async session({ session, token, user }) {
      session = token;
      return session;
    },
  },
} satisfies NextAuthOptions;
