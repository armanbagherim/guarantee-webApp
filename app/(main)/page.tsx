import { getServerSession } from "next-auth";
import CustomerClubPoint from "../components/design/CustomerClubPoint";
import LatestRequests from "../components/design/LatestRequests";
import NeedToAction from "../components/design/NeedToAction";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import Link from "next/link";
import {
  FaClipboardCheck,
  FaHistory,
  FaRegAddressCard,
  FaSearch,
} from "react-icons/fa";

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
function LinkCard({ href, icon, text }) {
  return (
    <Link href={href}>
      <div className="flex items-center justify-between p-5 bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 cursor-pointer text-center hover:bg-red-50">
        <span className="text-gray-800 text-sm md:text-sm font-bold">
          {text}
        </span>
        <div className="text-red-600 text-lg md:text-xl">{icon}</div>
      </div>
    </Link>
  );
}
export default async function Home() {
  const session = await getServerSession(authOptions);
  const { result: latestRequest } = await getLaterstRequest(session);
  const { result: needToActions } = await getNeedToActions(session);
  const { result: point } = await getTotalScore(session);
  console.log(latestRequest);

  return (
    <>
      <div className="md:my-10 mb-8 md:mb-8 px-4 md:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-2 md:gap-6">
          <LinkCard
            href="/availability"
            icon={<FaSearch />}
            text="استعلام کارت گارانتی"
          />
          <LinkCard
            href="/SubmitCard"
            icon={<FaRegAddressCard />}
            text="ثبت کارت VIP"
          />
          <LinkCard
            href="/SubmitCard"
            icon={<FaClipboardCheck />}
            text="ثبت کارت گارانتی"
          />
          <LinkCard
            href="/availability"
            icon={<FaHistory />}
            text="پیگیری درخواست‌ها"
          />
        </div>
      </div>
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-5">
          <CustomerClubPoint clubPoint={point} />
        </div>
        <div className="md:col-span-7">
          <LatestRequests
            requestTitle="درخواست گارانتی دستگاه"
            statusItems={latestRequest}
          />
          <NeedToAction session={session} needToActions={needToActions} />
        </div>
      </div>
    </>
  );
  // implement Customer club
  // implement last request
  // need to action requests
}
