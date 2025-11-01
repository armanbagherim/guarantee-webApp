import IrangsImportModule from "./Module";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "آپلود اطلاعات ایران جی اس",
};

const IrangsImportPage = () => {
  return <IrangsImportModule />;
};

export default IrangsImportPage;
