
import * as React from "react"
import { cn } from "@/lib/utils"

interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
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

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, pressed, onPressedChange, onClick, variant = "default", size = "default", ...props }, ref) => {
    const [internalPressed, setInternalPressed] = React.useState(false);
    
    const isControlled = pressed !== undefined;
    const isPressed = isControlled ? pressed : internalPressed;
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const newPressed = !isPressed;
      
      if (isControlled) {
        onPressedChange?.(newPressed);
      } else {
        setInternalPressed(newPressed);
        onPressedChange?.(newPressed);
      }
      
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          toggleVariants.variant[variant],
          toggleVariants.size[size],
          isPressed && "bg-gray-100 text-gray-900",
          className
        )}
        data-state={isPressed ? "on" : "off"}
        onClick={handleClick}
        {...props}
      />
    );
  }
);

Toggle.displayName = "Toggle";

export { Toggle, toggleVariants };
