
import * as React from "react"
import { Check, ChevronRight, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface DropdownMenuContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType | null>(null);

interface DropdownMenuProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DropdownMenu = ({ children, open: controlledOpen, onOpenChange }: DropdownMenuProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  
  const setOpen = React.useCallback((newOpen: boolean) => {
    if (isControlled) {
      onOpenChange?.(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  }, [isControlled, onOpenChange]);
  
  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { asChild?: boolean }
>(({ className, children, onClick, asChild, ...props }, ref) => {
  const context = React.useContext(DropdownMenuContext);
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    context?.setOpen(!context.open);
    onClick?.(e);
  };

  // Handle asChild prop by cloning the child element if it exists
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: handleClick,
      ref,
      ...props,
    });
  }
  
  return (
    <button
      ref={ref}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuGroup = ({ children, ...props }: React.ComponentProps<"div">) => (
  <div {...props}>{children}</div>
);

const DropdownMenuPortal = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const DropdownMenuSub = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">{children}</div>
);

const DropdownMenuRadioGroup = ({ children, ...props }: React.ComponentProps<"div">) => (
  <div {...props}>{children}</div>
);

const DropdownMenuSubTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </button>
));
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

const DropdownMenuSubContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { 
    sideOffset?: number;
    align?: "start" | "center" | "end";
    forceMount?: boolean;
  }
>(({ className, sideOffset = 4, align = "center", forceMount, ...props }, ref) => {
  const context = React.useContext(DropdownMenuContext);
  
  // Always render if forceMount is true, otherwise check context
  if (!forceMount && !context?.open) return null;
  
  const getAlignmentClass = () => {
    switch (align) {
      case "start":
        return "left-0";
      case "end":
        return "right-0";
      case "center":
      default:
        return "left-1/2 transform -translate-x-1/2";
    }
  };
  
  return (
    <DropdownMenuPortal>
      <div
        ref={ref}
        className={cn(
          "absolute top-full z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-gray-900 shadow-md animate-in fade-in-0 zoom-in-95",
          getAlignmentClass(),
          className
        )}
        style={{ marginTop: sideOffset }}
        {...props}
      />
    </DropdownMenuPortal>
  );
});
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { 
    inset?: boolean;
    asChild?: boolean;
  }
>(({ className, inset, asChild, children, ...props }, ref) => {
  // Handle asChild prop by cloning the child element if it exists
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      className: cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 hover:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-left",
        inset && "pl-8",
        className
      ),
      ref,
      ...props,
    });
  }

  return (
    <button
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 hover:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-left",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuCheckboxItem = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { checked?: boolean }
>(({ className, children, checked, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-gray-100 hover:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-left",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      {checked && <Check className="h-4 w-4" />}
    </span>
    {children}
  </button>
));
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

const DropdownMenuRadioItem = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-gray-100 hover:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-left",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <Circle className="h-2 w-2 fill-current" />
    </span>
    {children}
  </button>
));
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-gray-200", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
