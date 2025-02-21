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
import ChangeToNull from "@/app/components/admin-components/ChangeToNull";
import dynamic from "next/dynamic";
const SeoBox = dynamic(() => import("../../products/_components/SeoBox"), {
  ssr: false,
});
export default function Brands() {
  const [title, setTitle] = useAtom(pageTitle);

  useEffect(() => {
    setTitle({
      title: "افزودن برند جدید",
      buttonTitle: "",
      link: "",
    });
  }, []);

  const [name, setName] = useState();
  const [slug, setSlug] = useState();
  const [description, setDescription] = useState();
  const [metaDescription, setMetaDescription] = useState();
  const [metaKeywords, setMetaKeywords] = useState();
  const [metaTitle, setMetaTitle] = useState();
  const [priority, setPriority] = useState();

  const router = useRouter();

  const save = async () => {
    try {
      const req = await fetcher({
        url: "/v1/api/ecommerce/brands",
        method: "POST",
        body: {
          name,
          slug,
          metaKeywords,
          metaDescription,
          metaTitle,
          description,
          priority: priority === "null" ? null : +priority,
        },
      });
      toast.success("موفق");
      setTimeout(() => {
        router.push("/admin/ecommerce/brands");
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
          نام برند
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
          لینک برند
        </label>
        <input
          type="text"
          id="first_name"
          className="bg-gray-50 border mb-10 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
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
          className="bg-gray-50 border mb-10 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          required
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        />
        <input
          type="text"
          id="first_name"
          className="bg-gray-50 border border-gray-300 text-gray-900 mb-10 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          required
          onChange={(e) => setSlug(e.target.value)}
        />
      </div>
      <label htmlFor="">توضیحات</label>
      <SeoBox setDescription={setDescription} description={description} />
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
        onChange={(e) => setMetaTitle(ChangeToNull(e.target.value))}
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
        onChange={(e) => setMetaDescription(ChangeToNull(e.target.value))}
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
        onChange={(e) => setMetaKeywords(ChangeToNull(e.target.value))}
      />
      <SaveBar action={save} backUrl={"/admin/ecommerce/brands/"} />
    </div>
  );
}
