import { getServerSession } from "next-auth";
import CustomerClubPoint from "../components/design/CustomerClubPoint";
import { Cup, DashboardIcon } from "../components/design/icons";
import LatestRequests from "../components/design/LatestRequests";
import NeedToAction from "../components/design/NeedToAction";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";



async function getLaterstRequest(session) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/client/histories/latestRequest?limit=3&sortOrder=DESC`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    }
  );

  return res.json();
}

async function getNeedToActions(session) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/client/needActions`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    }
  );

  return res.json();
}

async function getTotalScore(session) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/client/userPoints/totalScore`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    }
  );

  return res.json();
}




export default async function Home() {
  const session = await getServerSession(authOptions);
  const { result: latestRequest } = await getLaterstRequest(session);
  const { result: needToActions } = await getNeedToActions(session);
  const { result: point } = await getTotalScore(session);
  console.log(latestRequest)

  return (
    <>
      <div className="grid md:grid-cols-12 gap-6 ">
        <div className="md:col-span-5">
          <CustomerClubPoint clubPoint={point} />
        </div>
        <div className="md:col-span-7">
          <LatestRequests requestTitle="درخواست گارانتی دستگاه"
            statusItems={latestRequest} />
          <NeedToAction session={session} needToActions={needToActions} />
        </div>
      </div>
    </>
  );
  // implement Customer club
  // implement last request
  // need to action requests
}
