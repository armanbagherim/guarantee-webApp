
"use client";
import { ConvertToNull } from "@/app/components/utils/ConvertToNull";
import { getSession, signIn, useSession } from "next-auth/react";
import Link from "next/link";
import {
  redirect,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import VerificationInput from "react-verification-input";

export default function SignInForm({ session }) {
  const router = useRouter();
  const pathname = useSearchParams();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [verifyCode, setVerifyCode] = useState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [signUp, setSignUp] = useState(true);

  const [state, setState] = useState("verify");
  const [number, setNumber] = useState();
  const [rule, setRule] = useState(false);
  const [userTypeId, setUserTypeId] = useState(1); // 1: حقیقی, 2: حقوقی
  const phoneNumberRegex = /^09\d{9}$/; // Iranian mobile number pattern
  const verificationCodeRegex = /^\d{4}$/; // Exactly 4 digits

  const handlePhoneNumberChange = (value) => {
    // Convert Persian/Arabic numbers to English
    const normalized = ConvertToNull({ value }).value || "";
    setPhoneNumber(normalized);
  };

  const handleNationalCodeChange = (value) => {
    // Convert Persian/Arabic numbers to English
    const normalized = ConvertToNull({ value }).value || "";
    setNationalCode(normalized);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumberRegex.test(phoneNumber)) {
      toast.error("لطفاً یک شماره موبایل معتبر وارد کنید", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    setLoading(true);

    if (state === "phone") {
      const result = await signIn("credentials", {
        phoneNumber,
        redirect: false,
        callbackUrl: "/verify",
      }).then(async (res) => {
        const session = await getSession();

        if (res.ok && session.signupStatus === true) {
          setState("verify");
          setNumber(phoneNumber);
          setLoading(false);
        } else if (res.ok && session.signupStatus === false) {
          setState("verify");
          setNumber(phoneNumber);
          setLoading(false);
          setSignUp(true);
        }
      });
    } else {
      if (!verificationCodeRegex.test(verifyCode)) {
        toast.error("لطفاً کد تایید 4 رقمی را وارد نمایید", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setLoading(false);
        return;
      }

      if (signUp && (firstName.length < 3 || lastName.length < 3)) {
        toast.error("نام و نام خانوادگی باید حداقل 3 کاراکتر باشد", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setLoading(false);
        return;
      }

      const redirectUrl = pathname.get("redirect_back_url") || "/";

      const result = await signIn("credentials", {
        verifyCode,
        phoneNumber,
        firstName,
        nationalCode,
        lastName,
        userTypeId,
        redirect: false,
        callbackUrl: redirectUrl,
      });
      if (result.status === 401) {
        toast.error(result.error);
        setLoading(false);
      } else {
        router.push(redirectUrl);
        router.refresh();
      }
    }
  };

  return (
    <div className="">
      <div className="login">
        <Toaster />

        <div className="mb-10 md:mb-0">
          <div className="h-full md:flex lg:flex xl:flex 2xl:flex shadow-none md:shadow-shadowCustom border-none md:border justify-center border border-[#F1F1F1] rounded-[30px]">
            <div className="flex-1 flex justify-center items-center py-2 md:py-40 lg:py-40 xl:py-40 2xl:py-40 bg-white">
              <div className="text-center w-full px-4 md:px-16">
                <h4 className="text-3xl mb-2 peyda font-bold">
                  ورود یا ثبت نام
                </h4>

                <form onSubmit={onSubmit}>
                  {state === "phone" && (
                    <div className="text-right md:m-0 lg:m-0 xl:m-0 2xl:m-0">
                      <h4 className="text-xs mb-3 font-bold">شماره موبایل</h4>
                      <input
                        autoFocus
                        className="bg-[#f6f6f6] tracking-[4px] text-center rounded-2xl py-4 w-full md:w-full lg:w-full xl:full px-6 outline-none mb-4"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => handlePhoneNumberChange(e.target.value)}
                      />
                    </div>
                  )}
                  {state === "verify" && (
                    <div className="text-right">
                      {signUp && (
                        <div className="flex flex-col gap-5">
                          <div className="flex justify-center mb-4 border-b border-gray-300 pb-2">
                            <div className="flex bg-gray-100 rounded-full p-1">
                              <button
                                type="button"
                                onClick={() => setUserTypeId(1)}
                                className={`px - 6 py - 2 rounded - full transition - colors ${userTypeId === 1
                                  ? "bg-primary text-white shadow-md"
                                  : "bg-transparent text-gray-700"
                                  } `}
                              >
                                مشتری حقیقی
                              </button>
                              <button
                                type="button"
                                onClick={() => setUserTypeId(2)}
                                className={`px - 6 py - 2 rounded - full transition - colors ${userTypeId === 2
                                  ? "bg-primary text-white shadow-md"
                                  : "bg-transparent text-gray-700"
                                  } `}
                              >
                                مشتری حقوقی
                              </button>
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <div className="w-full">
                              <h4 className="opacity-70 text-xs mb-3">نام</h4>
                              <input
                                className="bg-[#f6f6f6] border border-gray-300 text-right rounded-2xl py-4 px-6 w-full outline-none mb-4"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                              />
                            </div>
                            <div className="w-full">
                              <h4 className="opacity-70 text-xs mb-3">
                                نام خانوادگی
                              </h4>
                              <input
                                className="bg-[#f6f6f6] border border-gray-300 text-right rounded-2xl py-4 px-6 w-full outline-none mb-4"
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="w-full">
                            <h4 className="opacity-70 text-xs mb-3">
                              {userTypeId === 1 ? "کد ملی" : "شناسه ملی"}
                            </h4>
                            <input
                              className="bg-[#f6f6f6] border border-gray-300 text-right rounded-2xl py-4 px-6 w-full outline-none mb-4"
                              type="text"
                              value={nationalCode}
                              onChange={(e) =>
                                handleNationalCodeChange(e.target.value)
                              }
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between mb-4">
                        <span className="opacity-70 font-bold text-sm">
                          شماره موبایل: {number}
                        </span>
                        <span
                          onClick={() => {
                            setState("phone");
                            setRule(false);
                          }}
                          className="flex items-center opacity-70 cursor-pointer font-bold text-xs"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="ml-2"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8.83958 2.40006L3.36624 8.1934C3.15958 8.4134 2.95958 8.84673 2.91958 9.14673L2.67291 11.3067C2.58624 12.0867 3.14624 12.6201 3.91958 12.4867L6.06624 12.1201C6.36624 12.0667 6.78624 11.8467 6.99291 11.6201L12.4662 5.82673C13.4129 4.82673 13.8396 3.68673 12.3662 2.2934C10.8996 0.913397 9.78624 1.40006 8.83958 2.40006Z"
                              stroke="black"
                              strokeOpacity="0.7"
                              strokeWidth="1.5"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M7.92578 3.3667C8.21245 5.2067 9.70578 6.61337 11.5591 6.80003"
                              stroke="black"
                              strokeOpacity="0.7"
                              strokeWidth="1.5"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M2 14.6667H14"
                              stroke="black"
                              strokeOpacity="0.7"
                              strokeWidth="1.5"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          ویرایش شماره
                        </span>
                      </div>
                      <div dir="ltr">
                        <VerificationInput
                          onChange={(e) => setVerifyCode(e)}
                          autoFocus
                          placeholder="_"
                          inputProps={{
                            type: "tel",
                          }}
                          length={4}
                          classNames={{
                            container:
                              "bg-[#f6f6f6] border border-gray-300 text-left rounded-2xl py-3 px-6 mb-4 w-full outline-none",
                            character:
                              "border-0 bg-transparent p-0 text-lg outline-none",
                            characterInactive: "character--inactive",
                            characterSelected: "character--selected",
                            characterFilled: "character--filled",
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <button
                    className="bg-primary justify-center w-full text-white py-4 px-6 outline-0 rounded-2xl text-center flex items-center mb-4"
                    onClick={onSubmit}
                    disabled={loading}
                  >
                    <span>{state === "phone" ? "دریافت کد تایید" : "ورود"}</span>
                    <span
                      role="status"
                      className={`pr - 4 ${loading !== true && "hidden"} `}
                    >
                      <svg
                        aria-hidden="true"
                        className="w-6 h-6 text-primary animate-spin fill-white"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </span>
                  </button>
                </form>
              </div>
            </div>
            <div className="flex-1 pr-3 pl-3 lg:p-0">
              <img className="w-full" src="/login.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
