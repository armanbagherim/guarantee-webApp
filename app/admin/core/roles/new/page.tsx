"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetcher, useFetcher } from "@/app/components/admin-components/fetcher";
import Loading from "../../../../components/admin-components/loading";
import { toast } from "react-toastify";
import { useAtom } from "jotai";
import { pageTitle } from "../../../layout";
import SaveBar from "@/app/components/admin-components/SaveBar";

export default function Roles() {
  const [title, setTitle] = useAtom(pageTitle);

  useEffect(() => {
    setTitle({
      title: "افزودن نقش جدید",
      buttonTitle: "",
      link: "",
    });
  }, []);

  const [checkedPermissions, setCheckedPermissions] = useState([]);
  const [roleName, setRoleName] = useState();
  const router = useRouter();

  const {
    data: permissions,
    isLoading: permissionsIsLoading,
    error: permissionsError,
  } = useFetcher(
    `/v1/api/core/admin/permissionGroups?sortOrder=ASC&offset=0&limit=10&orderBy=id&ignorePaging=true`,
    "GET"
  );

  const handleCheckboxChange = (event) => {
    const permissionId = event.target.id;
    if (event.target.checked) {
      setCheckedPermissions((prevPermissions) => [
        ...prevPermissions,
        +permissionId,
      ]);
    } else {
      setCheckedPermissions((prevPermissions) =>
        prevPermissions.filter((id) => id !== +permissionId)
      );
    }
  };
  const save = async () => {
    try {
      const req = await fetcher({
        url: "/v1/api/core/admin/roles",
        method: "POST",
        body: {
          roleName,
          permissions: checkedPermissions,
        },
      });
      toast.success("موفق");
      setTimeout(() => {
        router.push("/admin/core/roles");
      }, 500);
    } catch (error) {
      toast.error(error.message);
    }
  };
  if (permissionsIsLoading) {
    return <Loading />;
  }
  return (
    <div>
      <div>
        <label
          for="first_name"
          class="block mb-2 text-sm font-medium text-gray-900 "
        >
          نام نقش
        </label>
        <input
          type="text"
          id="first_name"
          class="bg-gray-50 border mb-10 border-gray-300 text-gray-900  mb-10 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          required
          onChange={(e) => setRoleName(e.target.value)}
        />
      </div>
      <div>
        {permissions.result.map((group, key) => (
          <div key={key}>
            <div className="bg-gray-200 p-5 rounded-xl">
              {group.permissionGroupName}
            </div>
            <div className="px-5 py-6">
              {group.permissions.map((permission, key) => (
                <div key={key} className="flex gap-2 mb-1">
                  <input
                    id={permission.id}
                    className="ml-2"
                    type="checkbox"
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor={permission.id}>
                    {permission.permissionName}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <SaveBar action={save} backUrl={"/admin/core/roles/"} />
    </div>
  );
}
