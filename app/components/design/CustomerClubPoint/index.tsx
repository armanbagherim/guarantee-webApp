import React from "react";
import { CustomerClubVector } from "../Vectors";
import Card from "../Card";
import { Cup } from "../icons";

interface IClubPoints {
  clubPoint: number;
}

export default function CustomerClubPoint({ clubPoint }: IClubPoints) {
  return (
    <Card title="باشگاه مشتریان" link="/points" linkText="تاریخچه امتیاز">
      <div className="px-4">
        <h4 className="text-2xl text-center font-bold">امتیاز شما</h4>
        <div className="mx-auto flex justify-center flex-col">
          <div className="mb-8 text-center">
            <img src="/winner.png" className="h-auto w-[350px] mx-auto"/>
          </div>
          <div className="bg-primary flex justify-between p-4 text-white items-center rounded-[15px]">
            <Cup />{" "}
            <span className="xl:text-lg text-sm">
              شما {clubPoint} امتیاز دارید
            </span>{" "}
            <Cup />
          </div>
        </div>
      </div>
    </Card>
  );
}
