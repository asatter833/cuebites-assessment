import Image from "next/image";

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

//icons
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
import Link from "next/link";

const data = {
  header: {
    title: "Cuebites Digital",
    subtitle: "crm system",
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
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={"/dashboard"}>
                {data?.header?.logo ? (
                  <Image
                    src={data?.header?.logo}
                    alt={data?.header?.title}
                    height={32}
                    width={32}
                  />
                ) : (
                  <Codesandbox className="size-6!" />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-bold truncate">
                    {data?.header?.title}
                  </span>
                  <span className="text-xs truncate">
                    {data?.header?.subtitle}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {data.navItems.map((group) => (
          <SidebarGroup key={group.groupTitle}>
            <SidebarGroupLabel>{group.groupTitle}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton size="sm" asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {/* Profile Item */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={data.footer.user.url}>
                <data.footer.user.icon />
                <span>{data.footer.user.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Logout Item */}
          <SidebarMenuItem>
            <SidebarMenuButton
              // onClick={handleLogout}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <data.footer.logout.icon />
              <span>{data.footer.logout.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
