import { 
  HomeIcon, 
  FileTextIcon, 
  CalendarIcon, 
  CircleIcon, 
  TargetIcon, 
  ShieldCheckIcon, 
  AlertTriangleIcon, 
  UsersIcon,
  DatabaseIcon,
  LayoutDashboardIcon,
  ListTodoIcon,
  ClipboardListIcon,
  LayoutGridIcon,
  UserIcon
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: any;
  children?: NavItem[];
  isExpanded?: boolean;
}

export const sidebarNavigation: NavItem[] = [
  {
    title: "Home",
    href: "/dashboard",
    icon: HomeIcon,
    isExpanded: false
  },
  {
    title: "Audit Management",
    href: "#",
    icon: FileTextIcon,
    isExpanded: false,
    children: [
      {
        title: "Dashboard",
        href: "/audit/dashboard",
        icon: LayoutDashboardIcon
      },
      {
        title: "Audit Items",
        href: "/audit/items",
        icon: ListTodoIcon
      },
      {
        title: "Audits",
        href: "/audit/audits",
        icon: ClipboardListIcon
      },
      {
        title: "Planning",
        href: "/audit/planning",
        icon: CalendarIcon
      },
      {
        title: "Templates",
        href: "/audit/templates",
        icon: FileTextIcon
      },
      {
        title: "Categories",
        href: "/audit/categories",
        icon: LayoutGridIcon
      }
    ]
  },
  {
    title: "GRI",
    href: "#",
    icon: CircleIcon,
    isExpanded: false,
    children: [
      {
        title: "Dashboard",
        href: "/gri/dashboard",
        icon: LayoutDashboardIcon
      },
      {
        title: "Planning",
        href: "/gri/planning",
        icon: CalendarIcon
      },
      {
        title: "ESG Aura",
        href: "/gri/esg-aura",
        icon: CircleIcon
      },
      {
        title: "SDG Goals",
        href: "/gri/sdg-goals",
        icon: TargetIcon
      },
      {
        title: "Compliance Hub",
        href: "/gri/compliance-hub",
        icon: ShieldCheckIcon
      }
    ]
  },
  {
    title: "CAPAs",
    href: "/capas",
    icon: AlertTriangleIcon,
    isExpanded: false
  },
  {
    title: "Collaborate",
    href: "/collaborate",
    icon: UsersIcon,
    isExpanded: false
  },
  {
    title: "Organization",
    href: "#",
    icon: DatabaseIcon,
    isExpanded: false,
    children: [
      {
        title: "Group Management",
        href: "/organization/groups",
        icon: UsersIcon
      },
      {
        title: "User Management",
        href: "/organization/users",
        icon: UserIcon
      }
    ]
  }
];
