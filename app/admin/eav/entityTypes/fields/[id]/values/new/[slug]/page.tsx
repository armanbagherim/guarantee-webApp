"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetcher, useFetcher } from "@/app/components/admin-components/fetcher";
import Loading from "../../../../components/global/loading";
import { toast } from "react-toastify";
import { useAtom } from "jotai";
import { HexColorPicker } from "react-colorful";
import { pageTitle } from "@/app/admin/layout";
import SaveBar from "@/app/components/admin-components/SaveBar";

export default function NewConditions() {
  const params = useParams();
  const [title, setTitle] = useAtom(pageTitle);
  useEffect(() => {
    setTitle({
      title: "افزودن مقدار",
      buttonTitle: "",
      link: "",
    });
  }, []);
  const [value, setValue] = useState();

  const router = useRouter();

  const save = async () => {
    try {
      const req = await fetcher({
        url: "/v1/api/eav/admin/attributeValues",
        method: "POST",
        body: {
          value: value,
          attributeId: +params.id,
        },
      });
      toast.success("موفق");
      setTimeout(() => {
        router.push(`/admin/eav/entityTypes/fields/${params.id}/values`);
      }, 500);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
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
        onChange={(e) => setValue(e.target.value)}
      />

      <SaveBar
        action={save}
        backUrl={`/admin/eav/entityTypes/fields/${params.id}/values`}
      />
    </div>
  );
}
