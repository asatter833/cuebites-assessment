import { AppSidebar } from "@/components/custom/app-sidebar";
import { SidebarInsetContainer } from "@/components/custom/inset-container";
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
        <SidebarInsetContainer className="overflow-y-auto">
          {children}
        </SidebarInsetContainer>
      </SidebarInset>
    </SidebarProvider>
  );
}
