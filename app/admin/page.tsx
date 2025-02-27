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
            <h1 className="text-gray-900 text-3xl md:text-2xl font-extrabold mb-4">
              به پنل مدیریت آریا کیش خوش آمدید
            </h1>
            <p className="text-lg font-normal text-gray-500 ">
              در این پنل می توانید به مدیریت محصولات، تخفیفات، حمل و نقل،
              سفارشات، دسته بندی ها و تمامی امکانات سایت بپردازید
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
