import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import StoreProvider from "./StoreProvider";
import { auth } from "@/app/api/auth/[...nextauth]/configs";

export default async function AuthProvider({ children }: { children: ReactNode }) {
  const session = await auth();

  return (
    <SessionProvider session={session} refetchInterval={0} refetchOnWindowFocus={false}>
      <StoreProvider>
        {children}
      </StoreProvider>
    </SessionProvider>
  );
}
