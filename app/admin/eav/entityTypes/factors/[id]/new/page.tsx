"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetcher, useFetcher } from "@/app/components/admin-components/fetcher";
import { toast } from "react-toastify";
import { useAtom } from "jotai";
import { HexColorPicker } from "react-colorful";
import SaveBar from "@/app/components/admin-components/SaveBar";
import { pageTitle } from "@/app/admin/layout";

export default function Eav() {
  const params = useParams();
  const [title, setTitle] = useAtom(pageTitle);

  useEffect(() => {
    setTitle({
      title: "افزودن فاکتور کامنت جدید",
      buttonTitle: "",
      link: "",
    });
  }, []);

  const [name, setName] = useState(null);
  const [priority, setPriority] = useState(null);

  const router = useRouter();

  const save = async () => {
    try {
      const req = await fetcher({
        url: "/v1/api/ecommerce/admin/entityTypeFactors",
        method: "POST",
        body: {
          name,
          entityTypeId: +params.id,
          priority,
        },
      });
      toast.success("موفق");
      setTimeout(() => {
        router.push(`/admin/eav/entityTypes/factors/${params.id}`);
      }, 500);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div>
        <label
          htmlFor="first_name"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          نام
        </label>
        <input
          type="text"
          id="first_name"
          className="bg-gray-50 border mb-10 border-gray-300 text-gray-900  mb-10 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          required
          onChange={(e) => setName(e.target.value)}
        />
        <label
          htmlFor="first_name"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          اولویت
        </label>
        <input
          type="text"
          id="first_name"
          className="bg-gray-50 border mb-10 border-gray-300 text-gray-900  mb-10 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          required
          onChange={(e) => setPriority(+e.target.value)}
        />
      </div>

      <SaveBar action={save} backUrl={"/admin/eav/entityTypes/"} />
    </div>
  );
}
