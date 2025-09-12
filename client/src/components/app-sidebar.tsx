import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileDescription,
  IconFileWord,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconApi,
  IconKey,
  IconCreditCard,
  IconBuilding,
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
import { TeamSwitcher } from "./team-switcher";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "OCR Requests",
      url: "/requests",
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
      title: "Organizations",
      url: "/organizations",
      icon: IconBuilding,
    },
    // {
    //   title: "Billing",
    //   url: "#",
    //   icon: IconCreditCard,
    // },
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
        <TeamSwitcher />
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
