import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import Header from "@/components/header";
import { getPathName } from "@/lib/getPathName";
import { auth } from "../api/auth/[...nextauth]/configs";
import { Suspense } from "react";

export const revalidate = 60;

const layout = async ({ children }: { children: React.ReactNode }) => {
  const url = await getPathName();
  const isShortsPage = url.startsWith("/shorts/");

  const session = await auth();
  const status = session ? "authenticated" : "unauthenticated";

  return (
    // <div className="h-full bg-white-100 p-2">
    <SidebarProvider className="py-2 pr-2">
      <Suspense fallback={<p>Loading ....</p>}>
        <AppSidebar status={status} />
      </Suspense>

      <div className="flex-1 flex flex-col h-screen md:pl-2 relative ml-2 gap-2 pb-2">
        <Header />

        {children}
      </div>
    </SidebarProvider>
    // </div>
  );
};

export default layout;
