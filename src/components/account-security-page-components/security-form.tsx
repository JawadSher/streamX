"use client";

import { useUser } from "@/context/UserContext";

function SecurityForm() {
    const { userData } = useUser();

  return (
    <div>SecurityForm</div>
  )
}

export default SecurityForm