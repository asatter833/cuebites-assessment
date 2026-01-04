import { AppSidebar } from "@/components/custom/app-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Circle } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex justify-between items-center pb-2 pr-6">
          <SidebarTrigger className="ml-1" />
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10 rounded-lg border bg-red-200">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=utsha`}
              />
              <AvatarFallback>{"utsha"}</AvatarFallback>
            </Avatar>
            <span>
              <p>Abdus Satter</p>
              <p className="text-xs text-muted-foreground">Frontend Engineer</p>
            </span>
          </div>
        </div>
        <div className="overflow-y-auto flex flex-1 flex-col gap-4 p-4 rounded-tl-xl bg-background">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
