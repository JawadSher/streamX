import { cssUnfillProperty } from "@/constants/navConfig";
import { capitalize } from "@/lib/capitalize";
import React from "react";

interface Props {
  userName?: string | null;
  email?: string | null;
  accountStatus?: string | null;
  phoneNumber?: string | null;
  country?: string | null;
  isVerified?: boolean | null;
}

const SecondSection = ({
  userName,
  email,
  isVerified,
  accountStatus,
  phoneNumber,
  country,
}: Props) => {
  const accountStatusColor =
    accountStatus === "suspended"
      ? "text-yellow-500"
      : accountStatus === "deleted"
      ? "text-red-500"
      : "text-green-500";

  const infoList = [
    { icon: "person", label: userName || "Null" },
    { icon: "mail", label: email || "Null" },
    {
      icon: "account_box",
      label: (
        <>
          Verification{" "}
          <span className={isVerified ? "text-green-500" : "text-red-500"}>
            {isVerified ? "True" : "False"}
          </span>
        </>
      ),
    },
    {
      icon: "account_circle",
      label: (
        <>
          Account Status{" "}
          <span className={accountStatusColor}>
            {accountStatus ? capitalize(accountStatus) : "Unknown"}
          </span>
        </>
      ),
    },
    {
      icon: "call",
      label: phoneNumber || "Null",
    },
    {
      icon: "location_on",
      label: country || "Null",
    },
  ];

  return (
    <div className="w-full px-4 pt-6 dark:bg-zinc-900 transition-colors duration-300">
      <div className="space-y-2">
        {infoList.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 text-base font-medium"
          >
            <span
              className={`${cssUnfillProperty} text-zinc-600 dark:text-white text-lg`}
            >
              {item.icon}
            </span>
            <span className="text-zinc-800 dark:text-zinc-100">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecondSection;
