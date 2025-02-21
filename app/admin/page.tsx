"use client";
import React, { useState } from "react";
// import { BarChart } from "@mui/x-charts/BarChart";
// import { Box, Stack } from "@mui/material";
// import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
// import { PieChart } from "@mui/x-charts/PieChart";
// import Chart from "react-apexcharts";

export default function HomePage() {
  // const [state, setState] = useState({
  //   options: {
  //     chart: {
  //       id: "basic-bar",
  //     },
  //     stroke: {
  //       curve: "smooth",
  //     },
  //     xaxis: {
  //       categories: [1991, 1992, 19931999],
  //     },
  //   },
  //   series: [
  //     {
  //       name: "series-1",
  //       data: [30, 40, 45],
  //     },
  //   ],
  // });
  return (
    <>
      {/* <div classNameName="grid grid-cols-3 gap-4 mb-8">
        <div classNameName="p-8 rounded-xl bg-gray-100">
          <h4 classNameName="font-bold border-b pb-4 mb-8 border-b-gray-300">
            آمار فروش ۱ ماه اخیر
          </h4>
          <BarChart
            series={[
              { data: [35, 44, 24, 34] },
              { data: [51, 6, 49, 30] },
              { data: [15, 25, 30, 50] },
              { data: [60, 50, 15, 25] },
            ]}
            height={290}
            xAxis={[{ data: ["Q1", "Q2", "Q3", "Q4"], scaleType: "band" }]}
            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
          />
        </div>
        <div classNameName="p-8 rounded-xl bg-gray-100">
          <h4 classNameName="font-bold border-b pb-4 mb-8 border-b-gray-300">
            آمار فروش ۱ ماه اخیر
          </h4>
          <Stack direction="row" sx={{ width: "100%" }}>
            <Box sx={{ flexGrow: 1 }}>
              <Chart
                options={state.options}
                series={state.series}
                type="area"
                width="500"
              />
            </Box>
          </Stack>
        </div>
        <div classNameName="p-8 rounded-xl bg-gray-100">
          <h4 classNameName="font-bold border-b pb-4 mb-8 border-b-gray-300">
            آمار فروش ۱ ماه اخیر
          </h4>

          <PieChart
            height={300}
            series={[
              {
                data: [
                  { id: 0, value: 10, label: "پلو پز یونیک" },
                  { id: 1, value: 15, label: "اسپرسو ساز تک" },
                  { id: 2, value: 20, label: "شیکر بیلتی" },
                ],
                innerRadius: 30,
                outerRadius: 100,
                paddingAngle: 5,
                cornerRadius: 5,
                startAngle: -90,
                endAngle: 270,
                cx: 150,
                cy: 150,
              },
            ]}
          />
        </div>
      </div> */}
      <section className="bg-white ">
        <div className="py-2 mx-auto">
          <div className="bg-gray-50  border border-gray-200  rounded-3xl p-8 md:p-12 mb-8">
            <a
              href="#"
              className="bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md   mb-2"
            >
              <svg
                className="w-2.5 h-2.5 me-1.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 14"
              >
                <path d="M11 0H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm8.585 1.189a.994.994 0 0 0-.9-.138l-2.965.983a1 1 0 0 0-.685.949v8a1 1 0 0 0 .675.946l2.965 1.02a1.013 1.013 0 0 0 1.032-.242A1 1 0 0 0 20 12V2a1 1 0 0 0-.415-.811Z" />
              </svg>
              Tutorial
            </a>
            <h1 className="text-gray-900 text-3xl md:text-2xl font-extrabold mb-4">
              به پنل مدیریت جهیزان خوش آمدید
            </h1>
            <p className="text-lg font-normal text-gray-500  mb-6">
              در این پنل می توانید به مدیریت محصولات، تخفیفات، حمل و نقل،
              سفارشات، دسته بندی ها و تمامی امکانات سایت بپردازید
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
