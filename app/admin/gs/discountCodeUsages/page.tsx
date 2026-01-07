import DiscountCodeUsagesModule from "./Module";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "گزارش مصرف کد تخفیف",
};

const DiscountCodeUsagesPage = () => {
  return <DiscountCodeUsagesModule />;
};

export default DiscountCodeUsagesPage;
