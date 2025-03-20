import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const Home = () => {
  return (
    <div className="h-screen flex bg-white-100">
      <SidebarProvider>
        <AppSidebar />

        <div className="flex-1 flex flex-col h-screen relative px-4 overflow-auto">
          
          <header className="sticky top-2 p-4 z-50 bg-white/95 backdrop-blur-sm shadow-sm h-16 flex items-center px-4 border-b w-full mx-auto rounded-lg">
            <div className="flex items-center gap-3 w-full">
              <SidebarTrigger className="-ml-1" />
            </div>
          </header>

          <main className="flex-1 py-4 mx-auto">
            <div className="w-full ">
              <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 xlg:grid-cols-5">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div
                    key={i}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-normal duration-200 border border-gray-100 overflow-hidden"
                  >
                    <div className="aspect-video bg-gray-50 relative">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        Card {i + 1}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 truncate">
                        Card Title {i + 1}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        This is a brief description of the card content that
                        spans a couple of lines.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Home;
