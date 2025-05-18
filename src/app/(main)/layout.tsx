import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import Header from "@/components/header";
import { getPathName } from "@/lib/getPathName";
import { auth } from "../api/auth/[...nextauth]/configs";
import { Suspense } from "react";
import { getUserData } from "../actions/user-actions/getUserData.action";

export const revalidate = 60;

const layout = async ({ children }: { children: React.ReactNode }) => {
  const url = await getPathName();
  const isShortsPage = url.startsWith("/shorts/");

  const session = await auth();
  const status = session ? "authenticated" : "unauthenticated";
  const userData = status === "authenticated" ? await getUserData() : null;

  return (
    <div className="h-screen flex bg-white-100">
      <SidebarProvider>
        <Suspense fallback={<p>Loading ....</p>}>
          <AppSidebar status={status} userData={userData} />
        </Suspense>
        <div className="flex-1 flex flex-col h-screen pl-2 md:pl-4 relative overflow-auto">
          <div className="pt-2 pr-2">
            <Header />
          </div>
          <main className="flex-1 mx-auto w-full mt-1 pb-2 overflow-auto">
            <div className="h-full w-full overflow-auto pr-1 custom-scroll-bar">{children}</div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default layout;
