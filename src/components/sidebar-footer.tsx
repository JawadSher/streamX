import React from "react";
import { NavUser } from "./nav-user";
import Image from "next/image";
import Link from "next/link";
import { imagePaths } from "@/lib/ImagePaths";
import { IRedisDBUser } from "@/interfaces/IRedisDBUser";
import { Button } from "./ui/button";

const capitalize = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

export default function SidebarBottom({
  status,
  userData,
  state,
}: {
  status: string;
  state: string;
  userData: IRedisDBUser | null;
}) {
  if (status === "unauthenticated") {
    return (
      <Link href="/sign-in" className="w-full flex grow">
        {state === "collapsed" ? (
          <Image
            src={imagePaths.defaultUserLogo}
            alt="Login"
            width={32}
            height={32}
            className="mx-auto"
          />
        ) : (
          <Button className="w-full flex grow cursor-pointer rounded-2xl h-8">
            Sign in
          </Button>
        )}
      </Link>
    );
  }

  if (!userData) return null;

  const fullName =
    `${capitalize(userData.firstName || "")} ${capitalize(
      userData.lastName || ""
    )}`.trim() ||
    userData.userName ||
    "Unknown User";

  return (
    <NavUser
      user={{
        fullName,
        email: userData.email || null,
        avatar: userData.avatarURL || imagePaths.defaultUserLogo,
        isVerified: userData.isVerified,
      }}
    />
  );
}
