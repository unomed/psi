
import * as React from "react"
import { cn } from "@/lib/utils"

interface ToggleGroupContextType {
  type: "single" | "multiple";
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
}

const ToggleGroupContext = React.createContext<ToggleGroupContextType | null>(null);

interface ToggleGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  type: "single" | "multiple";
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
}

const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({ className, type, value, onValueChange, variant = "default", size = "default", children, ...props }, ref) => (
    <ToggleGroupContext.Provider value={{ type, value, onValueChange, variant, size }}>
      <div
        ref={ref}
        className={cn("flex items-center justify-center gap-1", className)}
        role={type === "single" ? "radiogroup" : "group"}
        {...props}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  )
);
ToggleGroup.displayName = "ToggleGroup";

interface ToggleGroupItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
}

const toggleVariants = {
  variant: {
    default: "bg-transparent hover:bg-gray-100 hover:text-gray-900 data-[state=on]:bg-gray-100 data-[state=on]:text-gray-900",
    outline: "border border-gray-200 bg-transparent hover:bg-gray-100 hover:text-gray-900 data-[state=on]:bg-gray-100 data-[state=on]:text-gray-900",
  },
  size: {
    default: "h-10 px-3",
    sm: "h-9 px-2.5", 
    lg: "h-11 px-5",
  },
};

const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ className, children, value: itemValue, variant, size, onClick, ...props }, ref) => {
    const context = React.useContext(ToggleGroupContext);
    
    const isPressed = React.useMemo(() => {
      if (!context?.value) return false;
      
      if (context.type === "single") {
        return context.value === itemValue;
      } else {
        return Array.isArray(context.value) && context.value.includes(itemValue);
      }
    }, [context, itemValue]);
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!context) return;
      
      if (context.type === "single") {
        const newValue = isPressed ? "" : itemValue;
        context.onValueChange?.(newValue);
      } else {
        const currentValue = Array.isArray(context.value) ? context.value : [];
        const newValue = isPressed 
          ? currentValue.filter(v => v !== itemValue)
          : [...currentValue, itemValue];
        context.onValueChange?.(newValue);
      }
      
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          toggleVariants.variant[variant || context?.variant || "default"],
          toggleVariants.size[size || context?.size || "default"],
          isPressed && "bg-gray-100 text-gray-900",
          className
        )}
        data-state={isPressed ? "on" : "off"}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);
ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };
