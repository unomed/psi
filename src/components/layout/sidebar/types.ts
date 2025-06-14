
import { LucideIcon } from "lucide-react";

export interface MenuItem {
  title: string;
  icon: LucideIcon;
  href: string;
  roles: string[];
  permission?: string;
  path?: string;
}
