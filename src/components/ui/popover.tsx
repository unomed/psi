
import * as React from "react"
import { cn } from "@/lib/utils"

// POPOVER NATIVO - SEM RADIX UI
const Popover = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & { 
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(({ children, className, open, onOpenChange, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(open || false);

  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <div ref={ref} className={cn("relative inline-block", className)} {...props}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          if (child.type === PopoverTrigger) {
            return React.cloneElement(child as any, { 
              onClick: () => handleOpenChange(!isOpen),
              ...child.props 
            });
          }
          if (child.type === PopoverContent) {
            return isOpen ? React.cloneElement(child as any, child.props) : null;
          }
        }
        return child;
      })}
    </div>
  );
});
Popover.displayName = "Popover"

const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button"> & {
    asChild?: boolean;
  }
>(({ className, asChild, children, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      className: cn(className, children.props.className),
    });
  }

  return (
    <button
      ref={ref}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
});
PopoverTrigger.displayName = "PopoverTrigger"

const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & {
    align?: "center" | "start" | "end";
    sideOffset?: number;
  }
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md",
      "absolute top-full mt-1",
      align === "center" && "left-1/2 transform -translate-x-1/2",
      align === "start" && "left-0",
      align === "end" && "right-0",
      className
    )}
    style={{ marginTop: sideOffset }}
    {...props}
  />
));
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }
