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
import { authClient } from "@/lib/auth-client";

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
      title: "Billing",
      url: "/billing",
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
  const {
    data: organizations,
    isPending,
  } = authClient.useListOrganizations();
  const { data: auth } = authClient.useSession();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        {
          isPending ? <div>Loading...</div> : <TeamSwitcher data={organizations || []} activeOrganizationId={auth?.session?.activeOrganizationId} />
        }
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
