import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconApi,
  IconKey,
  IconCreditCard,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "OCR Requests",
      url: "#",
      icon: IconListDetails,
    },
    {
      title: "Analytics",
      url: "#",
      icon: IconChartBar,
    },
    {
      title: "API Keys",
      url: "/api-keys",
      icon: IconKey,
    },
    {
      title: "Billing",
      url: "#",
      icon: IconCreditCard,
    },
  ],
  navClouds: [
    {
      title: "Car Plates",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Recent Scans",
          url: "#",
        },
        {
          title: "History",
          url: "#",
        },
      ],
    },
    {
      title: "Documents",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Invoices",
          url: "#",
        },
        {
          title: "Receipts",
          url: "#",
        },
        {
          title: "IDs",
          url: "#",
        },
      ],
    },
    {
      title: "API",
      icon: IconApi,
      url: "#",
      items: [
        {
          title: "Documentation",
          url: "#",
        },
        {
          title: "SDKs",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Usage Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Integration Guide",
      url: "#",
      icon: IconFileWord,
    },
    {
      name: "Model Performance",
      url: "#",
      icon: IconDatabase,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">OCRus</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
