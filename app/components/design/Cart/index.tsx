import React from "react";

interface ICard {
  cardName?: string;
  data: any;
}

const Cart: React.FC<ICard> = (props) => {
  return (
    <div
      className="px-7  py-8 overflow-hidden relative rounded-[30px] flex flex-col justify-between gap-8"
      style={{ backgroundColor: `${props.color}` }} // 80 is 50% opacity in hex
    >
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
        fill="red"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse opacity="0.1" cx="19" cy="88" rx="84" ry="88" fill="#000" />
      </svg>

      <div className="flex items-center justify-between">
        <span className="font-bold text-sm text-white">
          {props.data.guaranteePeriod.title}
        </span>
        <span className="font-bold text-sm text-white">
          برند: {props.data.brand.title}
        </span>
      </div>
      <div className="text-center text-white font-bold my-6 text-xl">
        {props.data?.productType?.title}
      </div>
      <div className="flex items-center text-white justify-between">
        <span>
          {new Date(props.data?.endDate).toLocaleDateString("fa-ir")}{" "}
          <span className="text-xs font-bold">
            {new Date(props?.data?.endDate) < new Date() && "منقضی شده"}
          </span>
        </span>
        <span>{props?.data?.serialNumber}</span>
      </div>
    </div>
  );
};

export default Cart;
