"use client";

import Offline from "./offline";
import Online from "./online";

function NetworkStatus({ isOnline }: { isOnline: boolean }) {
  if (!isOnline) return <Offline />;

  return <Online />;
}

export default NetworkStatus;
