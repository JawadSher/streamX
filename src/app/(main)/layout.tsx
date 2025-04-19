import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header";
import { getPathName } from "@/lib/getPathName";
import { auth } from "../api/auth/[...nextauth]/configs";
import { getUserData } from "../actions/getUserData";
import { Suspense } from "react";

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
        <div
          className={`flex-1 flex flex-col h-screen px-2 pl-2 md:pl-4 ${
            isShortsPage ? "overflow-hidden" : "overflow-auto custom-scroll-bar"
          }`}
        >
          <Header />

          <main className="flex-1 mx-auto w-full mt-3">{children}</main>

        </div>
      </SidebarProvider>
    </div>
  );
};

export default layout;
