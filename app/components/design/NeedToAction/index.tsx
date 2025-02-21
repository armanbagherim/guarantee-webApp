"use client";
import { IRequest } from "@/app/interfaces/IRequest";
import React from "react";
import Card from "../Card";
import Link from "next/link";
import { INeedtoAction } from "@/app/interfaces/INeedtoAction";

interface Props {
  needToActions: INeedtoAction[];
}

export default function NeedToAction({ needToActions }: Props) {
  return (
    <div className="mb-4">
      <Card title="درخواست های نیازمند اقدام">
        <div className="px-4">
          {needToActions.map((needToAction: INeedtoAction, key: number) => {
            return (
              <div key={key} className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold ">{needToAction.title}</h2>
                <Link
                  className="bg-primary text-sm px-2 font-bold py-2 text-white rounded-xl"
                  href="#"
                  onClick={(e) => needToAction.actionType}
                >
                  جزئیات و اقدام
                </Link>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
