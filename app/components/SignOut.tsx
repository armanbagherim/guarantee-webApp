"use client";
import { signOut } from "next-auth/react";
import { ChevronLeft } from "./design/Icons";
import { deleteCookie } from "cookies-next";

const SignOutButton = ({ hasIcon = true }) => {
  const handleSignOut = () => {
    deleteCookie("SessionName");
    signOut();
  };
  return (
    <>
      <li
        className="mb-2 text-sm flex justify-between cursor-pointer"
        onClick={() => handleSignOut()}
      >
        <span>خروج</span>
        {hasIcon ? (
          <span>
            <ChevronLeft />
          </span>
        ) : (
          ""
        )}
      </li>
    </>
  );
};

export default SignOutButton;
