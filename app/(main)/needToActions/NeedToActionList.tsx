"use client";
import { INeedtoAction } from "@/app/interfaces/INeedtoAction";
import React, { useState } from "react";
import Card from "@/app/components/design/Card";
import { FaInbox, FaExclamationTriangle } from "react-icons/fa";
import FormGen from "@/app/components/design/NeedToAction/FormsGen";

interface Props {
  needToActions: INeedtoAction[];
  session: any;
}

export default function NeedToActionList({ needToActions, session }: Props) {
  const [triggered, setTriggered] = useState(false);
  const [activeRequestActionModal, setActiveRequestActionModal] = useState({
    currentOperation: null,
    isOpen: false,
  });

  return (
    <div>
      <FormGen
        triggered={triggered}
        setTriggered={setTriggered}
        session={session}
        action={activeRequestActionModal}
        setAction={setActiveRequestActionModal}
      />

      {needToActions?.length > 0 ? (
        <div className="space-y-4">
          {needToActions.map((needToAction: INeedtoAction, key: number) => {
            return (
              <Card key={key} title="">
                <div className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-red-100 rounded-full p-2">
                          <FaExclamationTriangle className="text-red-600 text-lg" />
                        </div>
                        <h2 className="text-lg md:text-xl font-bold text-gray-900">
                          {needToAction.activity.name}
                        </h2>
                      </div>
                      <p className="text-sm md:text-base text-gray-600 pr-12">
                        برای درخواست{" "}
                        <span className="text-primary font-semibold">
                          {needToAction.guaranteeRequest.requestType.title}{" "}
                          {needToAction.guaranteeRequest.productType?.title || ""}
                        </span>
                      </p>
                    </div>
                    <button
                      className="bg-primary hover:bg-primary/90 text-white text-sm md:text-base font-bold px-4 md:px-6 py-2 md:py-3 rounded-xl transition-all duration-300 hover:shadow-lg w-full md:w-auto whitespace-nowrap"
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
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card title="">
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <FaInbox className="text-5xl md:text-6xl mb-4 text-gray-300" />
            <p className="text-lg md:text-xl font-semibold mb-2">
              درخواستی برای نمایش وجود ندارد
            </p>
            <p className="text-sm md:text-base text-center">
              هیچ درخواستی نیازمند اقدام شما نیست
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

