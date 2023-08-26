import { BillboardClient } from "@/components/BillboardClient";
import React from "react";

interface pageProps {}

const page: React.FC<pageProps> = ({}) => {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient />
      </div>
    </div>
  );
};

export default page;
