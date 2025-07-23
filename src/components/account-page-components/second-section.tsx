import { capitalize } from "@/lib/capitalize";
import React from "react";
import { Separator } from "../ui/separator";
import * as LucideIcons from "lucide-react";
import { Badge } from "../ui/badge";
import AccountStatusBadge from "./accountStatusBadge";
import AccountVerificationStatusBadge from "./accountVerficationStatusBadge";

interface Props {
  userName?: string | null;
  email?: string | null;
  accountStatus?: string | null;
  phoneNumber?: string | null;
  country?: string | null;
  isVerified?: boolean | null;
  createdAt?: Date | number | string | null;
}

const iconMap: { [key: string]: React.ComponentType<any> } = {
  User: LucideIcons.User,
  Mail: LucideIcons.Mail,
  UserSquare: LucideIcons.UserSquare,
  UserRound: LucideIcons.UserRound,
  Phone: LucideIcons.Phone,
  MapPin: LucideIcons.MapPin,
  Calendar: LucideIcons.Calendar,
};

const SecondSection = ({
  userName,
  email,
  isVerified,
  accountStatus,
  phoneNumber,
  country,
  createdAt,
}: Props) => {

  const infoList = [
    { icon: "User", label: userName || "Null" },
    { icon: "Mail", label: email || "Null" },
    {
      icon: "UserSquare",
      label: (
        <>
          Verification{" "}
          <AccountVerificationStatusBadge accountVerificationStatus={isVerified} />
        </>
      ),
    },
    {
      icon: "UserRound",
      label: (
        <>
          Account Status{" "}
          <AccountStatusBadge accountStatus={accountStatus} />
        </>
      ),
    },
    {
      icon: "Phone",
      label: phoneNumber || "Null",
    },
    {
      icon: "MapPin",
      label: country || "Null",
    },
    {
      icon: "Calendar",
      label: (
        <span className="text-zinc-800 dark:text-zinc-300">
          Since joined •{" "}
          <span className="font-semibold">
            {createdAt ? new Date(createdAt).getFullYear() : "Unknown"}
          </span>
        </span>
      ),
    },
  ];

  return (
    <div className="w-full px-4 pt-6 dark:bg-zinc-900 transition-colors duration-300">
      <div className="space-y-4">
        {infoList.map((item, index) => {
          const IconComponent = iconMap[item.icon] || LucideIcons.HelpCircle;
          return (
            <div
              key={index}
              className="flex items-center gap-3 text-base font-medium text-zinc-800 dark:text-zinc-100 leading-none py-[2px]"
            >
              <div className="flex items-center justify-center w-[22px]">
                <IconComponent
                  size={20}
                  className="text-zinc-600 dark:text-zinc-300"
                />
              </div>
              <div className="flex-1">{item.label}</div>
            </div>
          );
        })}
      </div>

      <Separator className="mt-6 mb-4" />

      <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-400">
        <p className="font-semibold">Important Notes:</p>
        <ul className="list-disc list-inside space-y-1 text-center">
          <li>Ensure your account information is up to date.</li>
        </ul>
      </div>
    </div>
  );
};

export default SecondSection;
