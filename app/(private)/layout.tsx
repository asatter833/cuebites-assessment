import { AppSidebar } from "@/components/custom/app-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-slate-50/50">
        {/* Compact Top Header */}
        <header className="flex h-14 shrink-0 items-center justify-between px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 text-slate-500 hover:text-slate-900" />
            <Separator
              orientation="vertical"
              className="mr-2 h-4 bg-slate-200"
            />
            <h1 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Workspace
            </h1>
          </div>

          <div className="flex items-center gap-3 pr-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold leading-none text-slate-900 tracking-tight">
                Abdus Satter
              </p>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">
                Frontend Engineer
              </p>
            </div>
            <Avatar className="h-8 w-8 rounded-md border border-slate-200 shadow-sm">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=utsha`}
              />
              <AvatarFallback className="bg-slate-100 text-[10px] font-bold">
                AS
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className=" flex-1 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
