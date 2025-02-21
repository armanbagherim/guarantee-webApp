import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { isRedirectError } from "next/dist/client/components/redirect";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        phoneNumber: {
          label: "phoneNumber",
          type: "text",
          placeholder: "jsmith",
        },
      },
      async authorize(credentials, req) {
        const { phoneNumber, verifyCode, firstName, lastName } = credentials;
        let res;

        if (phoneNumber && !verifyCode) {
          try {
            res = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/ecommerce/user/login`,
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
            `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/ecommerce/user/login/verifyCode`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                code: verifyCode,
                firstname: firstName || "",
                lastname: lastName || "",
                phoneNumber,
              }),
            }
          );
          if (res.status === 400) {
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
