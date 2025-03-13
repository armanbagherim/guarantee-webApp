import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Cart from "@/app/components/design/Cart";
import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";
import UserAddressesModule from "./Module";

export default function UserAddresses() {
  return <UserAddressesModule />;
}
