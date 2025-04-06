import { IRequest } from "@/app/interfaces/IRequest";
import React from "react";
import Card from "../Card";
import Link from "next/link";

interface RequestStatusItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  from: string;
  to: string;
  nodeCommand: string;
  nodeCommandColor: string;
  description: string | null;
}

interface LatestRequestsProps {
  requestTitle: string;
  statusItems: RequestStatusItem[];
}

export default function LatestRequests({ requestTitle, statusItems }: LatestRequestsProps) {
  return (
    <div className="mb-4">
      <Card title="وضعیت آخرین درخواست گارانتی">
        <div className="px-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold">{requestTitle}</h2>
            <Link
              className="bg-primary text-sm px-4 py-2 text-white rounded-xl"
              href="#"
            >
              جزئیات
            </Link>
          </div>
          <ul className="relative">
            <span className="absolute right-[6px] top-0 h-full bg-[#F0F0F0] w-[1.5px] z-[0]"></span>
            {statusItems?.map((item) => (
              <li key={item.id} className="flex items-center gap-2 mb-4">
                <span
                  className="w-[13px] h-[13px] inline-flex rounded-full relative z-10"
                  style={{ backgroundColor: item.nodeCommandColor }}
                ></span>
                <div className="flex flex-col">
                  <span className="text-xs font-medium">
                    {item.nodeCommand}
                  </span>
                  <span className="text-xs text-gray-500">
                    از: {item.from}
                  </span>
                  <span className="text-xs text-gray-500">
                    به: {item.to}
                  </span>
                  {item.description && (
                    <span className="text-xs text-gray-400 mt-1">
                      توضیحات: {item.description}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 mt-1">
                    {new Date(item.createdAt).toLocaleString('fa-IR')}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}