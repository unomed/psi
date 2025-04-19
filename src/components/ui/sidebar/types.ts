
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "./variants";

export interface SidebarContext {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
}

export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof buttonVariants> {}

