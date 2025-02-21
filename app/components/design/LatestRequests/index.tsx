import { IRequest } from "@/app/interfaces/IRequest";
import React from "react";
import Card from "../Card";
import Link from "next/link";

interface Props {
  request: IRequest;
}

export default function LatestRequests({ request }: Props) {
  return (
    <div className="mb-4">
      <Card title="وضعیت آخرین درخواست گارانتی">
        <div className="px-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold ">{request.title}</h2>
            <Link
              className="bg-primary text-sm px-4 py-2 text-white rounded-xl"
              href="#"
            >
              جزئیات
            </Link>
          </div>
          <ul className="relative">
            <span className="absolute right-[6px] top-0 h-full bg-[#F0F0F0] w-[1.5px] z-[0]"></span>
            {request.history.map((historyItem, index) => (
              <li key={index} className="flex items-center gap-2 mb-4">
                <span
                  className={`w-[13px] h-[13px] inline-flex rounded-full relative z-10 ${
                    historyItem.status == "Success"
                      ? "bg-[#0DB12B]"
                      : "bg-[#EDD23C]"
                  }`}
                ></span>
                <span className="text-xs">{historyItem.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}
