"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useFetcher, fetcher } from "@/app/components/admin-components/fetcher";
import Loading from "../../../../components/admin-components/loading";
import { useAtom } from "jotai";
import { pageTitle } from "../../../layout";
import SaveBar from "@/app/components/admin-components/SaveBar";

export default function Page() {
  const params = useParams();
  const [title, setTitle] = useAtom(pageTitle);

  useEffect(() => {
    setTitle({
      title: "ویرایش نقش",
      buttonTitle: "",
      link: "",
    });
  }, []);
  const router = useRouter();

  const {
    data: role,
    isLoading: roleLoading,
    error: roleError,
  } = useFetcher(`/v1/api/core/admin/roles/${params.id}`, "GET");
  const {
    data: permissions,
    isLoading: permissionsLoading,
    error: permissionsError,
  } = useFetcher(
    `/v1/api/core/admin/permissionGroups?sortOrder=ASC&offset=0&limit=10&orderBy=id&ignorePaging=true`,
    "GET"
  );
  const [checkedPermissions, setCheckedPermissions] = useState([]);
  const [roleName, setRoleName] = useState("");

  useEffect(() => {
    if (role) {
      setRoleName(role.result.roleName);
      setCheckedPermissions(
        role.result.permissions.map((permission) => permission.id)
      );
    }
  }, [role]);

  const isPermissionChecked = (permissionId) => {
    return checkedPermissions.includes(permissionId);
  };

  const save = async () => {
    try {
      await fetcher({
        url: `/v1/api/core/admin/roles/${params.id}`,
        method: "PUT",
        body: {
          roleName,
          permissions: checkedPermissions,
        },
      });
      toast.success("موفق");
      setTimeout(() => {
        router.push("/admin/core/roles");
      }, 500);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handlePermissionChange = (permissionId) => {
    const updatedPermissions = [...checkedPermissions];
    if (updatedPermissions.includes(permissionId)) {
      const index = updatedPermissions.indexOf(permissionId);
      updatedPermissions.splice(index, 1);
    } else {
      updatedPermissions.push(permissionId);
    }
    setCheckedPermissions(updatedPermissions);
  };
  if (roleLoading || permissionsLoading) {
    return <Loading />;
  }
  return (
    <div>
      <label
        htmlFor="first_name"
        className="block mb-2 text-sm font-medium text-gray-900 "
      >
        نام نقش
      </label>
      <input
        type="text"
        id="first_name"
        className="bg-gray-50 border mb-10 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        required
        value={roleName}
        onChange={(e) => setRoleName(e.target.value)}
      />
      {permissions.result.map((group, key) => (
        <div key={key}>
          <div className="bg-gray-200 p-5 rounded-xl">
            {group.permissionGroupName}
          </div>
          <div className="px-5 py-6">
            {group.permissions.map((permission, key) => (
              <div key={key} className="flex gap-2 mb-1">
                <input
                  type="checkbox"
                  checked={isPermissionChecked(permission.id)}
                  onChange={() => handlePermissionChange(permission.id)}
                />
                <div>{permission.permissionName}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <SaveBar action={save} backUrl={"/admin/core/roles/"} />
    </div>
  );
}
