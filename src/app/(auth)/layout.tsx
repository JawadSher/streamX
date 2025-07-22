import React, { ReactNode } from "react";

function LayoutAuth({ children }: { children: ReactNode }) {
  return <div className="flex w-full h-full p-4">{children}</div>;
}

export default LayoutAuth;
