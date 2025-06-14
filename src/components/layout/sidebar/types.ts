
import { LucideIcon } from "lucide-react";

export interface MenuItem {
  title: string;
  icon: LucideIcon;
  href: string;
  roles: string[];
  permission?: string;
  subItems?: SubMenuItem[];
}

export interface SubMenuItem {
  title: string;
  href: string;
  roles?: string[];
  permission?: string;
}

export interface SettingsMenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles?: string[];
  permission?: string;
}
