import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import StoreProvider from "./StoreProvider";
import { auth } from "@/app/api/auth/[...nextauth]/configs";
import UserDataFetcher from "./UserDataFetcher";
import { getUserData } from "@/app/actions/user-actions/getUserData.action";

interface AuthProviderProps {
  children: ReactNode;
}

export default async function AuthProvider({ children }: AuthProviderProps) {
  const session = await auth();

  let initialUserData = null;
  if (session?.user?._id) {
    initialUserData = await getUserData();
  }

  return (
    <SessionProvider session={session}>
      <StoreProvider>
        {session?.user?._id && (
          <UserDataFetcher initialUserData={initialUserData} />
        )}
        {children}
      </StoreProvider>
    </SessionProvider>
  );
}
