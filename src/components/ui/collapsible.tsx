
import * as React from "react"
import { cn } from "@/lib/utils"

interface CollapsibleContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CollapsibleContext = React.createContext<CollapsibleContextType | null>(null);

interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ className, open: controlledOpen, onOpenChange, defaultOpen = false, children, ...props }, ref) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;
    
    const handleOpenChange = React.useCallback((newOpen: boolean) => {
      if (isControlled) {
        onOpenChange?.(newOpen);
      } else {
        setInternalOpen(newOpen);
        onOpenChange?.(newOpen);
      }
    }, [isControlled, onOpenChange]);

    return (
      <CollapsibleContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
        <div ref={ref} className={cn("space-y-2", className)} {...props}>
          {children}
        </div>
      </CollapsibleContext.Provider>
    );
  }
);
Collapsible.displayName = "Collapsible";

const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { asChild?: boolean }
>(({ className, children, onClick, asChild, ...props }, ref) => {
  const context = React.useContext(CollapsibleContext);
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    context?.onOpenChange(!context.open);
    onClick?.(e);
  };

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
      className={cn("flex w-full items-center justify-between", className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});
CollapsibleTrigger.displayName = "CollapsibleTrigger";

const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(CollapsibleContext);
  
  if (!context?.open) return null;
  
  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden transition-all duration-200 ease-in-out animate-in slide-in-from-top-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
