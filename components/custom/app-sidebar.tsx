import { Calendar, Home, Inbox, Settings } from "lucide-react";
import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  header: {
    title: "Cuebites Digital",
    logo: "/favicon.ico",
  },
  navItems: [
    {
      groupTitle: "General",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: Home },
        { title: "Scheduler", url: "/scheduler", icon: Inbox },
        { title: "Staff", url: "/staff", icon: Calendar },
        { title: "Settings", url: "/settings", icon: Settings },
      ],
    },
  ],
};

export function AppSidebar() {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="flex flex-row items-center gap-2 px-2 py-2">
        <Image
          src={data.header.logo}
          width={32}
          height={32}
          alt="Cuebites Digital"
        />
        <span className="text-sm font-semibold truncate">
          {data.header.title}
        </span>
      </SidebarHeader>

      <SidebarContent>
        {data.navItems.map((group) => (
          <SidebarGroup key={group.groupTitle}>
            <SidebarGroupLabel>{group.groupTitle}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
