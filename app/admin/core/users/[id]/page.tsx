"use client";
import { fetcher, useFetcher } from "@/app/components/admin-components/fetcher";
import Loading from "@/app/components/admin-components/loading";
import { redirect, useParams, useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast"; // Import toast from react-hot-toast
import { useAtom } from "jotai";
import { pageTitle } from "@/app/admin/layout";
import SaveBar from "@/app/components/admin-components/SaveBar";

interface User {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  username: string;
  roles: { id: string; roleName: string }[];
}

interface Role {
  id: string;
  roleName: string;
}

interface PageProps {
  params: { id: string };
}

export default function Users() {
  const [title, setTitle] = useAtom(pageTitle);
  const params = useParams();
  useEffect(() => {
    setTitle({
      title: "ویرایش کاربر",
      buttonTitle: "",
      link: "",
    });
  }, []);

  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[] | null>(null);
  const [checkedRoles, setCheckedRoles] = useState<string[]>([]);
  const [formData, setFormData] = useState<User>({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    phoneNumber: "",
    roles: [],
  });

  // Use useFetcher for getUser and getRoles
  const {
    data: userData,
    isLoading: userIsLoading,
    error: userError,
  } = useFetcher(`/v1/api/core/admin/users/${params.id}`, "GET");
  const {
    data: rolesData,
    isLoading: rolesIsLoading,
    error: rolesError,
  } = useFetcher(`/v1/api/core/admin/roles?ignorePaging=true`, "GET");

  useEffect(() => {
    if (userData) {
      setUser(userData.result);
      setCheckedRoles(userData.result.roles.map((role) => role.id));
      setFormData({
        firstname: userData.result.firstname,
        lastname: userData.result.lastname,
        email: userData.result.email,
        phoneNumber: userData.result.phoneNumber,
        roles: userData.result.roles,
        username: userData.result.username,
      });
    }
    if (rolesData) {
      setRoles(rolesData.result);
    }
  }, [userData, rolesData]);
  const isRoleChecked = (roleId: string): boolean => {
    return checkedRoles.includes(roleId);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const save = async (): Promise<void> => {
    const req = await fetcher({
      url: `/v1/api/core/admin/users/${params.id}`,
      method: "PUT",
      body: {
        ...formData,
        roles: checkedRoles,
      },
    })
      .then((result) => {
        toast.success("موفق");
        setTimeout(() => {
          router.push("/admin/core/users");
        }, 500);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const handleRoleChange = (roleId: string): void => {
    const updatedRoles = [...checkedRoles];
    if (updatedRoles.includes(roleId)) {
      const index = updatedRoles.indexOf(roleId);
      updatedRoles.splice(index, 1);
    } else {
      updatedRoles.push(roleId);
    }
    setCheckedRoles(updatedRoles);
  };

  if (userIsLoading || rolesIsLoading) {
    return <Loading />;
  }
  return (
    <div>
      <div className="flex gap-5">
        <div className="mb-5 flex-1">
          <label
            htmlFor="firstname"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            نام
          </label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleInputChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            placeholder="نام"
          />
        </div>
        <div className="mb-5 flex-1">
          <label
            htmlFor="lastname"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            نام خانوادگی
          </label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleInputChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            placeholder="نام خانوادگی"
          />
        </div>
        <div className="mb-5 flex-1">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            ایمیل
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            placeholder="ایمیل"
          />
        </div>
        <div className="mb-5 flex-1">
          <label
            htmlFor="phoneNumber"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            شماره موبایل
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            placeholder="شماره موبایل"
          />
        </div>
      </div>
      <div className="flex gap-5">
        <div className="mb-5 flex-1">
          <div className="bg-gray-200 p-3 rounded-xl">نقش های کاربر</div>
          {roles?.map((role, key) => (
            <div key={key}>
              <div className="py-2">
                <div className="text-right" key={key} dir="ltr">
                  <label htmlFor={role.id} className="mr-2">
                    {role.roleName}
                  </label>
                  <input
                    id={role.id}
                    type="checkbox"
                    checked={isRoleChecked(role.id)}
                    onChange={() => handleRoleChange(role.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SaveBar action={save} backUrl={"/admin/core/users/"} />
    </div>
  );
}
