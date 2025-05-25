import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import StoreProvider from "./StoreProvider";
import { auth } from "@/app/api/auth/[...nextauth]/configs";

export default async function AuthProvider({ children }: { children: ReactNode }) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <StoreProvider>
        {children}
      </StoreProvider>
    </SessionProvider>
  );
}
