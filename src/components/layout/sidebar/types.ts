
import { LucideIcon } from "lucide-react";

export interface MenuItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  roles: string[];
  permission?: string;
  isExternal?: boolean;
  subItems?: SubMenuItem[];
}

export interface SubMenuItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  roles: string[];
  permission?: string;
}
