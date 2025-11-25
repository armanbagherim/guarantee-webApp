"use client";
import { IRequest } from "@/app/interfaces/IRequest";
import React, { useState } from "react";
import Card from "../Card";
import Link from "next/link";
import { INeedtoAction } from "@/app/interfaces/INeedtoAction";
import { FaInbox } from "react-icons/fa"; // Importing an icon from react-icons
import FormGen from "./FormsGen";

interface Props {
  needToActions: INeedtoAction[];
  session: any; // Added session prop type
}

export default function NeedToAction({ needToActions, session }: Props) {
  const [triggered, setTriggered] = useState(false);
  const [activeRequestActionModal, setActiveRequestActionModal] = useState({
    currentOperation: null,
    isOpen: false,
  });

  return (
    <div className="mb-4">
      <FormGen
        triggered={triggered}
        setTriggered={setTriggered}
        session={session}
        action={activeRequestActionModal}
        setAction={setActiveRequestActionModal}
      />

      <Card title="درخواست های نیازمند اقدام">
        <div className="px-4">
          {needToActions?.length > 0 ? (
            needToActions.map((needToAction: INeedtoAction, key: number) => {
              return (
                <div
                  key={key}
                  className="flex items-center justify-between mb-2"
                >
                  <div>
                    <h2 className="text-sm font-bold">
                      {needToAction.activity.name}
                    </h2>
                    <p className="text-xs">
                      برای درخواست{" "}
                      <span className="text-primary">
                        {needToAction.guaranteeRequest.requestType.title}{" "}
                        {needToAction.guaranteeRequest.productType.title}
                      </span>
                    </p>
                  </div>
                  <button
                    className="bg-primary text-sm px-2 font-bold py-2 text-white rounded-xl"
                    onClick={async (e) => {
                      setActiveRequestActionModal({
                        currentOperation: needToAction,
                        isOpen: true,
                      });
                    }}
                  >
                    جزئیات و اقدام
                  </button>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <FaInbox className="text-4xl mb-4" />
              <p className="text-lg">درخواستی برای نمایش وجود ندارد</p>
              <p className="text-sm mt-2">
                هیچ درخواستی نیازمند اقدام شما نیست
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}