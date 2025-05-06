import { Link2 } from "lucide-react";
import Link from "next/link";
import React from "react";

function UserLinks() {
  return (
    <div className="flex gap-1 items-center justify-center">
      <Link2 className="rotate-300" size={18} color="#2478ff" />
      <Link href={"example.com"} className="text-sm font-sm text-[#2478ff]">
        Social media links
      </Link>
    </div>
  );
}

export default UserLinks;
