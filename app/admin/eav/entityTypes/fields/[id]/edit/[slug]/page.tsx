"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetcher, useFetcher } from "@/app/components/admin-components/fetcher";
import { toast } from "react-toastify";
import { useAtom } from "jotai";
import { pageTitle } from "@/app/admin/layout";
import Loading from "@/app/components/admin-components/loading";
import SaveBar from "@/app/components/admin-components/SaveBar";

export default function Eav() {
  const params = useParams();
  const [title, setTitle] = useAtom(pageTitle);
  useEffect(() => {
    setTitle({
      title: "ویرایش فیلد",
      buttonTitle: "",
      link: "",
    });
  }, []);
  const [name, setName] = useState();
  const [min, setMin] = useState(null);
  const [max, setMax] = useState(null);
  const [attributeTypeId, setAttributeTypeId] = useState(1);
  const [isRequired, setIsRequired] = useState(false);
  const router = useRouter();

  const {
    data: attributes,
    isLoading: attributesIsLoading,
    error: attributesError,
  } = useFetcher(`/v1/api/eav/admin/attributes/${params.slug}`, "GET");

  const {
    data: attributeTypes,
    isLoading: attributeTypesIsLoading,
    error: attributeTypesError,
  } = useFetcher(
    `/v1/api/eav/admin/attributeTypes?sortOrder=ASC&orderBy=id&ignorePaging=true`,
    "GET"
  );
  useEffect(() => {
    if (attributesIsLoading === false) {
      setName(attributes.result.name);
      setMin(attributes.result.minLength);
      setMax(attributes.result.maxLength);
      setAttributeTypeId(attributes.result.attributeTypeId);
      setIsRequired(
        attributes.result.required === null ? false : attributes.result.required
      );
    }
  }, [attributesIsLoading]);

  const saveField = async () => {
    try {
      const req = await fetcher({
        url: `/v1/api/eav/admin/attributes/${params.slug}`,
        method: "PUT",
        body: {
          required: isRequired,
          attributeTypeId: +attributeTypeId,
          entityTypeId: +params.id,
          name,
          minLength: min ? +min : null,
          maxLength: max ? +max : null,
        },
      });
      toast.success("موفق");
      setTimeout(() => {
        router.push(`/admin/eav/entityTypes/fields/${params.id}`);
      }, 500);
    } catch (error) {
      toast.error(error.message);
    }
  };
  if (attributesIsLoading) {
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
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <div className="flex gap-4">
          <div className="w-full">
            <label
              htmlFor="first_name"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              حداقل طول کارکتر
            </label>
            <input
              type="text"
              id="first_name"
              className="bg-gray-50 border mb-10 border-gray-300 text-gray-900  mb-10 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              // required
              onChange={(e) => setMin(e.target.value)}
              value={min}
            />
          </div>

          <div className="w-full">
            <label
              htmlFor="first_name"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              حداکثر طول کارکتر
            </label>
            <input
              type="text"
              id="first_name"
              className="bg-gray-50 border mb-10 border-gray-300 text-gray-900  mb-10 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              // required
              value={max}
              onChange={(e) => setMax(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-full">
          <label
            htmlFor="countries_multiple"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            نوع فیلد
          </label>

          <select
            id="countries_multiple"
            value={attributeTypeId}
            className="bg-gray-50 border mb-10 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            onChange={(e) => setAttributeTypeId(e.target.value)}
          >
            {attributeTypes &&
              attributeTypes.result.map((value, key) => {
                return (
                  <>
                    <option key={key} value={value.id}>
                      {value.name}
                    </option>
                  </>
                );
              })}
          </select>
        </div>
        <div className="w-full flex">
          <label htmlFor="required" className="ml-4">
            اجباری؟
          </label>
          <input
            type="checkbox"
            name=""
            checked={isRequired}
            onChange={(e) => setIsRequired(e.target.checked)}
            id="required"
          />
        </div>
      </div>

      {/* <button
        onClick={saveField}
        className="bg-blue-700 text-white px-6 hover:bg-transparent hover:border hover:border-blue-700 hover:text-blue-700 transition-all py-3 border border-transparent rounded-xl"
      >
        ذخیره
      </button> */}
      <SaveBar
        action={saveField}
        backUrl={`/admin/eav/entityTypes/fields/${params.id}`}
      ></SaveBar>
    </div>
  );
}
