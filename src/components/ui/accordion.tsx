
import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccordionContextType {
  type: "single" | "multiple";
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
}

const AccordionContext = React.createContext<AccordionContextType | null>(null);

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type: "single" | "multiple";
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  defaultValue?: string | string[];
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, type, value: controlledValue, onValueChange, defaultValue, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState<string | string[]>(
      defaultValue || (type === "single" ? "" : [])
    );
    
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;
    
    const handleValueChange = React.useCallback((newValue: string | string[]) => {
      if (isControlled) {
        onValueChange?.(newValue);
      } else {
        setInternalValue(newValue);
        onValueChange?.(newValue);
      }
    }, [isControlled, onValueChange]);

    return (
      <AccordionContext.Provider value={{ type, value, onValueChange: handleValueChange }}>
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

interface AccordionItemContextType {
  value: string;
  isOpen: boolean;
  toggle: () => void;
}

const AccordionItemContext = React.createContext<AccordionItemContextType | null>(null);

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value: itemValue, children, ...props }, ref) => {
    const context = React.useContext(AccordionContext);
    
    const isOpen = React.useMemo(() => {
      if (!context) return false;
      
      if (context.type === "single") {
        return context.value === itemValue;
      } else {
        return Array.isArray(context.value) && context.value.includes(itemValue);
      }
    }, [context, itemValue]);
    
    const toggle = React.useCallback(() => {
      if (!context) return;
      
      if (context.type === "single") {
        const newValue = isOpen ? "" : itemValue;
        context.onValueChange?.(newValue);
      } else {
        const currentValue = Array.isArray(context.value) ? context.value : [];
        const newValue = isOpen 
          ? currentValue.filter(v => v !== itemValue)
          : [...currentValue, itemValue];
        context.onValueChange?.(newValue);
      }
    }, [context, isOpen, itemValue]);

    return (
      <AccordionItemContext.Provider value={{ value: itemValue, isOpen, toggle }}>
        <div
          ref={ref}
          className={cn("border-b", className)}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, children, onClick, ...props }, ref) => {
  const itemContext = React.useContext(AccordionItemContext);
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    itemContext?.toggle();
    onClick?.(e);
  };

  return (
    <div className="flex">
      <button
        ref={ref}
        className={cn(
          "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
          className
        )}
        data-state={itemContext?.isOpen ? "open" : "closed"}
        onClick={handleClick}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
      </button>
    </div>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  const itemContext = React.useContext(AccordionItemContext);
  
  if (!itemContext?.isOpen) return null;

  return (
    <div
      ref={ref}
      className="overflow-hidden text-sm transition-all duration-200 ease-in-out animate-in slide-in-from-top-1"
      data-state={itemContext.isOpen ? "open" : "closed"}
      {...props}
    >
      <div className={cn("pb-4 pt-0", className)}>{children}</div>
    </div>
  );
});
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
