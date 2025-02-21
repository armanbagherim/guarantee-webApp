"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetcher, useFetcher } from "@/app/components/global/fetcher";
import { toast } from "react-toastify";
import { useAtom } from "jotai";
import { HexColorPicker } from "react-colorful";
import { pageTitle } from "@/app/admin/layout";
import Loading from "@/app/components/global/loading";
import SaveBar from "@/app/components/global/SaveBar";

export default function Eav() {
  const params = useParams()
  const [title, setTitle] = useAtom(pageTitle);
  useEffect(() => {
    setTitle({
      title: "ویرایش مقدار",
      buttonTitle: "",
      link: "",
    });
  }, []);
  const [value, setValue] = useState();
  const router = useRouter();

  const {
    data: values,
    isLoading: valuesIsLoading,
    error: valuesError,
  } = useFetcher(`/v1/api/eav/admin/attributeValues/${params.valueId}`, "GET");
  useEffect(() => {
    if (valuesIsLoading === false) {
      setValue(values.result.value);
    }
  }, [valuesIsLoading]);
  const save = async () => {
    try {
      const req = await fetcher({
        url: `/v1/api/eav/admin/attributeValues/${params.valueId}`,
        method: "PUT",
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
  if (valuesIsLoading) {
    return <Loading />;
  }
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
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <SaveBar
        action={save}
        backUrl={`/admin/eav/entityTypes/fields/${params.id}/values`}
      />
    </div>
  );
}
