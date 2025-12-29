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
  FaExclamationTriangle,
  FaArrowLeft,
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

  // Check if user has any need to action requests
  const hasNeedToActions = needToActions && needToActions.length > 0;
  const actionCount = hasNeedToActions ? needToActions.length : 0;

  return (
    <>
      {/* Alert Banner for Need to Action Requests */}
      {hasNeedToActions && (
        <div className="w-full px-4 md:px-0 mb-4 md:mb-6">
          <Link href="/needToActions" className="block">
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl shadow-2xl p-4 md:p-6 border-4 border-red-500 hover:border-red-400 transition-all duration-300 hover:shadow-red-500/50 cursor-pointer relative overflow-hidden">
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent animate-pulse"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
                <div className="flex items-center gap-3 md:gap-4 flex-1 w-full md:w-auto">
                  <div className="bg-white/25 rounded-full p-3 md:p-4 flex-shrink-0 shadow-lg">
                    <FaExclamationTriangle className="text-2xl md:text-3xl animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-2xl font-extrabold mb-2 text-center md:text-right leading-tight">
                      ⚠️ درخواست نیازمند اقدام دارید!
                    </h3>
                    <p className="text-sm md:text-base text-center md:text-right opacity-95 leading-relaxed">
                      شما <span className="font-bold text-xl md:text-2xl bg-white/25 px-3 py-1 rounded-lg mx-1 inline-block">{actionCount}</span> درخواست نیازمند اقدام دارید.
                      <br className="md:hidden" />
                      <span className="block mt-1 md:inline md:mt-0">برای مشاهده و انجام اقدامات لازم، روی این پیام کلیک کنید.</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 bg-white/25 hover:bg-white/35 rounded-xl px-5 md:px-8 py-3 md:py-4 transition-all duration-300 whitespace-nowrap w-full md:w-auto shadow-lg hover:shadow-xl">
                  <span className="text-base md:text-lg font-bold">مشاهده</span>
                  <FaArrowLeft className="text-base md:text-lg" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

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
            href="/requests"
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
