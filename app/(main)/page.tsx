import CustomerClubPoint from "../components/design/CustomerClubPoint";
import { Cup, DashboardIcon } from "../components/design/icons";
import LatestRequests from "../components/design/LatestRequests";
import NeedToAction from "../components/design/NeedToAction";
import { INeedtoAction } from "../interfaces/INeedtoAction";
import type { IRequest } from "../interfaces/IRequest";

export default async function Home() {
  const requestData: IRequest = {
    title: "درخواست تعمیر کالای جارو رباتیک XIAOMI ",
    history: [
      { title: "درخواست توسط کارشناسات تایید شده است", status: "Success" },
      { title: "دریافت وجه با مذاکره با مشتری انجام شد", status: "Success" },
      {
        title: "دستگاه در انتظار تعمیر توسط کارشناسان می باشد",
        status: "Pending",
      },
    ],
  };

  const needToActions: INeedtoAction[] = [
    {
      title: "درخواست تعمیر کالای جارو رباتیک XIAOMI ",
      actionType: "address",
    },
  ];
  return (
    <>
      <div className="grid md:grid-cols-12 gap-6 mt-8 ">
        <div className="md:col-span-5">
          <CustomerClubPoint clubPoint={2} />
        </div>
        <div className="md:col-span-7">
          <LatestRequests request={requestData} />
          <NeedToAction needToActions={needToActions} />
        </div>
      </div>
    </>
  );
  // implement Customer club
  // implement last request
  // need to action requests
}
