import React from "react";

interface VipCardProps {
    data: {
        id: string;
        serialNumber: string;
        startDate: string;
        endDate: string;
        vipBundleTypeId: number;
        totalCredit: string;
        availableCredit: string;
        vipBundleType: {
            id: number;
            cardColor: string;
        };
    };
    cardName?: string;
}

const VipCard: React.FC<VipCardProps> = ({ data, cardName }) => {
    const isExpired = new Date(data.endDate) < new Date();
    const formattedEndDate = new Date(data.endDate).toLocaleDateString("fa-IR");
    const formattedStartDate = new Date(data.startDate).toLocaleDateString("fa-IR");
    console.log(data)
    return (
        <div
            className="px-7 py-8 overflow-hidden relative rounded-[30px] flex flex-col justify-between gap-8"
            style={{
                backgroundColor: `${data?.cardColor}`, // 80 is 50% opacity in hex
            }}
        >
            {/* Decorative circles */}
            <svg
                className="absolute top-[-10px] right-[-10px]"
                width="98"
                height="97"
                viewBox="0 0 98 97"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle opacity="0.08" cx="62.5" cy="34.5" r="62.5" fill="#000" />
            </svg>
            <svg
                className="absolute bottom-[-10px] left-[-10px]"
                width="103"
                height="82"
                viewBox="0 0 103 82"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <ellipse opacity="0.1" cx="19" cy="88" rx="84" ry="88" fill="#000" />
            </svg>

            {/* Card content */}
            <div className="flex items-center justify-between z-10">
                {cardName && (
                    <span className="font-bold text-sm text-white">{cardName}</span>
                )}
                <span className="font-bold text-sm text-white">
                    کارت VIP
                </span>
            </div>

            <div className="text-center text-white font-bold flex flex-col my-6 text-xl z-10">
                <div className="flex flex-col">

                    <div className="flex flex-col">
                        <span className="text-sm">قیمت</span>
                        {Number(data?.price).toLocaleString()} تومان

                    </div>
                </div>
            </div>
            <div className="flex items-center text-white justify-between z-10">
                <div className="flex flex-col">
                    <span className="text-xs">{data?.monthPeriod} ماهه</span>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <span className="text-sm font-bold">اعتبار دریافتی</span>
                    <span>{Number(data?.fee).toLocaleString()} تومان</span>
                </div>
            </div>

        </div>
    );
};

export default VipCard;