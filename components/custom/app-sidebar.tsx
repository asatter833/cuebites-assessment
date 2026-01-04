"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Settings,
  LayoutDashboard,
  TableProperties,
  ContactRound,
  SquareUser,
  Codesandbox,
  Users,
  UserPlus,
  BadgeDollarSign,
  BarChart3,
  Briefcase,
  LogOut,
} from "lucide-react";

const data = {
  header: {
    title: "Cuebites Digital",
    subtitle: "CRM SYSTEM",
    logo: null,
  },
  navItems: [
    {
      groupTitle: "General",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "Schedules", url: "/schedules", icon: TableProperties },
        { title: "Staff", url: "/staff", icon: ContactRound },
        { title: "Settings", url: "/settings", icon: Settings },
      ],
    },
    {
      groupTitle: "Management",
      items: [
        { title: "Clients", url: "/clients", icon: Users },
        { title: "Leads", url: "/leads", icon: UserPlus },
        { title: "Revenue", url: "/revenue", icon: BadgeDollarSign },
        { title: "Analytics", url: "/analytics", icon: BarChart3 },
        { title: "Projects", url: "/projects", icon: Briefcase },
      ],
    },
  ],
  footer: {
    user: {
      title: "Profile",
      url: "/profile",
      icon: SquareUser,
    },
    logout: {
      title: "Logout",
      icon: LogOut,
    },
  },
};

export function AppSidebar() {
  return (
    <Sidebar variant="inset" collapsible="icon" className=" border-slate-200">
      <SidebarHeader className="p-3 border-b border-slate-100 bg-slate-50/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="hover:bg-transparent"
            >
              <Link href={"/dashboard"} className="flex gap-3">
                <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-slate-900 text-white shrink-0 shadow-sm">
                  {data?.header?.logo ? (
                    <Image
                      src={data?.header?.logo}
                      alt={data?.header?.title}
                      height={20}
                      width={20}
                    />
                  ) : (
                    <Codesandbox className="size-4" />
                  )}
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate text-sm font-bold text-slate-900 uppercase tracking-tight">
                    {data?.header?.title}
                  </span>
                  <span className="truncate text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                    {data?.header?.subtitle}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0 py-2">
        {data.navItems.map((group) => (
          <SidebarGroup key={group.groupTitle} className="py-2">
            <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              {group.groupTitle}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5 px-2">
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      size="sm"
                      asChild
                      className="h-8 px-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    >
                      <Link href={item.url} className="flex gap-3">
                        <item.icon className="size-4 shrink-0" />
                        <span className="text-[13px] font-medium tracking-tight">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-slate-100">
        <SidebarMenu className="gap-0.5">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="sm"
              className="h-8 px-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <Link href={data.footer.user.url} className="flex gap-3">
                <data.footer.user.icon className="size-4 shrink-0" />
                <span className="text-[13px] font-medium tracking-tight">
                  {data.footer.user.title}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              size="sm"
              className="h-8 px-3 text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <data.footer.logout.icon className="size-4 shrink-0" />
                <span className="text-[13px] font-medium tracking-tight">
                  {data.footer.logout.title}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
