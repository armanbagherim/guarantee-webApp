import DiscountCodesModule from "./Module";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت کدهای تخفیف",
};

const DiscountCodesPage = () => {
  return <DiscountCodesModule />;
};

export default DiscountCodesPage;
