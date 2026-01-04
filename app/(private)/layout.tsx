import { AppSidebar } from "@/components/custom/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex items-center pb-2">
          <SidebarTrigger className="ml-1" />
        </div>
        <div className="overflow-y-auto flex flex-1 flex-col gap-4 p-4 rounded-tl-xl bg-background">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
