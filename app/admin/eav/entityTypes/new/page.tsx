"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetcher, useFetcher } from "@/app/components/admin-components/fetcher";
import Loading from "../../../../components/admin-components/loading";
import { toast } from "react-toastify";
import { useAtom } from "jotai";
import { pageTitle } from "../../../layout";
import { HexColorPicker } from "react-colorful";
import SaveBar from "@/app/components/admin-components/SaveBar";
import dynamic from "next/dynamic";
import ChangeToNull from "@/app/components/admin-components/ChangeToNull";
const SeoBox = dynamic(
  () => import("@/app/admin/ecommerce/products/_components/SeoBox"),
  { ssr: false }
);
export default function Eav() {
  const [title, setTitle] = useAtom(pageTitle);

  useEffect(() => {
    setTitle({
      title: "افزودن دسته جدید",
      buttonTitle: "",
      link: "",
    });
  }, []);

  const [name, setName] = useState();
  const [slug, setSlug] = useState();
  const [metaDescription, setMetaDescription] = useState();
  const [metaKeywords, setMetaKeywords] = useState();
  const [metaTitle, setMetaTitle] = useState();
  const [parentEntityTypeId, setParentEntityTypeId] = useState();
  const [description, setDescription] = useState();
  const [priority, setPriority] = useState();

  const router = useRouter();

  const {
    data: parentEntityTypes,
    isLoading: parentEntityTypesIsLoading,
    error: parentEntityTypesError,
  } = useFetcher(
    `/v1/api/eav/admin/entityTypes?sortOrder=ASC&entityModelId=1&ignoreChilds=true&ignorePaging=true`,
    "GET"
  );
  const save = async () => {
    try {
      const req = await fetcher({
        url: "/v1/api/eav/admin/entityTypes",
        method: "POST",
        body: {
          name,
          slug,
          parentEntityTypeId:
            parentEntityTypeId === "null" ? null : +parentEntityTypeId,
          entityModelId: 1,
          metaKeywords,
          description,
          metaDescription,
          metaTitle,
          priority: priority === "null" ? null : +priority,
        },
      });
      toast.success("موفق");
      setTimeout(() => {
        router.push("/admin/eav/entityTypes");
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
          لینک
        </label>
        <input
          type="text"
          id="first_name"
          className="bg-gray-50 border mb-10 border-gray-300 text-gray-900  mb-10 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          required
          onChange={(e) => setSlug(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="">توضیحات</label>
        <SeoBox setDescription={setDescription} description={description} />
      </div>
      <label
        htmlFor="countries_multiple"
        className="block mb-2 text-sm font-medium text-gray-900 "
      >
        دسته بندی پدر
      </label>
      {parentEntityTypesIsLoading ? (
        "در حال بارگزاری"
      ) : (
        <select
          id="countries_multiple"
          className="bg-gray-50 border mb-10 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          onChange={(e) => setParentEntityTypeId(e.target.value)}
        >
          <option value={null}>بدون پدر</option>
          {parentEntityTypes.result.map((value, key) => {
            return (
              <>
                <option key={key} value={value.id}>
                  {value.name}
                </option>

                {value.subEntityTypes.map((sub, subKey) => {
                  return (
                    <>
                      <option key={subKey} value={sub.id}>
                        -- {sub.name}
                      </option>
                    </>
                  );
                })}
              </>
            );
          })}
        </select>
      )}
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
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      />
      <label
        htmlFor="first_name"
        className="block mb-2 text-sm font-medium text-gray-900 "
      >
        عنوان سئو
      </label>
      <input
        type="text"
        id="first_name"
        className="bg-gray-50 border mb-10 border-gray-300 text-gray-900  mb-10 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        required
        value={metaTitle}
        onChange={(e) => setMetaTitle(e.target.value)}
      />
      <label
        htmlFor="first_name"
        className="block mb-2 text-sm font-medium text-gray-900 "
      >
        توضیحات سئو
      </label>
      <input
        type="text"
        id="first_name"
        className="bg-gray-50 border mb-10 border-gray-300 text-gray-900  mb-10 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        required
        value={metaDescription}
        onChange={(e) => setMetaDescription(e.target.value)}
      />

      <label
        htmlFor="first_name"
        className="block mb-2 text-sm font-medium text-gray-900 "
      >
        کلمات کلیدی (با کاما جدا شود)
      </label>
      <input
        type="text"
        id="first_name"
        className="bg-gray-50 border mb-10 border-gray-300 text-gray-900  mb-10 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        required
        value={metaKeywords}
        onChange={(e) => setMetaKeywords(e.target.value)}
      />
      <SaveBar action={save} backUrl={"/admin/eav/entityTypes/"} />
    </div>
  );
}
