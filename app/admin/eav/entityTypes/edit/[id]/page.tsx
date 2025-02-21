"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetcher, useFetcher } from "@/app/components/admin-components/fetcher";
import { toast } from "react-toastify";
import { useAtom } from "jotai";
import { HexColorPicker } from "react-colorful";
import { pageTitle } from "@/app/admin/layout";
import Loading from "@/app/components/admin-components/loading";
import SaveBar from "@/app/components/admin-components/SaveBar";
import SeoBox from "@/app/admin/ecommerce/products/_components/SeoBox";
import ChangeToNull from "@/app/components/admin-components/ChangeToNull";
import { setPriority } from "os";

export default function Eav() {
  const params = useParams();
  const [title, setTitle] = useAtom(pageTitle);

  useEffect(() => {
    setTitle({
      title: "ویرایش دسته",
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
  const [parentEntityTypeId, setParentEntityTypeId] = useState();
  const [priority, setPriority] = useState();
  const router = useRouter();

  const {
    data: entityType,
    isLoading: entityTypeIsLoading,
    error: entityTypeError,
  } = useFetcher(
    `/v1/api/eav/admin/entityTypes/${params.id}?sortOrder=ASC&entityModelId=1&ignoreChilds=true&ignorePaging=true`,
    "GET"
  );

  const {
    data: parentEntityTypes,
    isLoading: parentEntityTypesIsLoading,
    error: parentEntityTypesError,
  } = useFetcher(
    `/v1/api/eav/admin/entityTypes?sortOrder=ASC&entityModelId=1&ignoreChilds=true&ignorePaging=true`,
    "GET"
  );

  useEffect(() => {
    if (entityTypeIsLoading === false) {
      setName(entityType.result.name);
      setSlug(entityType.result.slug);
      setDescription(
        entityType.result.description ? entityType.result.description : ""
      );
      setMetaDescription(entityType.result.metaDescription);
      setMetaKeywords(entityType.result.metaKeywords);
      setMetaTitle(entityType.result.metaTitle);
      setParentEntityTypeId(entityType.result.parentEntityTypeId);
      setPriority(entityType.result.priority);
    }
  }, [entityTypeIsLoading]);

  const save = async () => {
    try {
      const req = await fetcher({
        url: `/v1/api/eav/admin/entityTypes/${params.id}`,
        method: "PUT",
        body: {
          name,
          slug,
          parentEntityTypeId:
            parentEntityTypeId === "null" ? null : +parentEntityTypeId,
          entityModelId: 1,
          metaKeywords,
          metaDescription,
          description: ChangeToNull(description),
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
  if (entityTypeIsLoading) {
    return <Loading />;
  }

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
          value={name}
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
          value={slug}
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
                <option
                  selected={
                    entityType.result.parentEntityTypeId === value.id
                      ? "selected"
                      : ""
                  }
                  key={key}
                  value={value.id}
                >
                  {value.name}
                </option>

                {value.subEntityTypes.map((sub, subKey) => {
                  return (
                    <option
                      selected={
                        entityType.result.parentEntityTypeId === sub.id
                          ? "selected"
                          : ""
                      }
                      key={subKey}
                      value={sub.id}
                    >
                      -- {sub.name}
                    </option>
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
