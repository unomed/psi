
import * as React from "react"
import { Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface RadioGroupContextType {
  value?: string;
  onValueChange?: (value: string) => void;
  name: string;
}

const RadioGroupContext = React.createContext<RadioGroupContextType | null>(null);

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  name?: string;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value: controlledValue, onValueChange, defaultValue, name, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || "");
    const radioGroupName = name || `radio-group-${React.useId()}`;
    
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;
    
    const handleValueChange = React.useCallback((newValue: string) => {
      if (isControlled) {
        onValueChange?.(newValue);
      } else {
        setInternalValue(newValue);
        onValueChange?.(newValue);
      }
    }, [isControlled, onValueChange]);

    return (
      <RadioGroupContext.Provider value={{ value, onValueChange: handleValueChange, name: radioGroupName }}>
        <div
          ref={ref}
          className={cn("grid gap-2", className)}
          role="radiogroup"
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value: itemValue, children, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext);
    
    if (!context) {
      throw new Error("RadioGroupItem must be used within a RadioGroup");
    }
    
    const isChecked = context.value === itemValue;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        context.onValueChange?.(itemValue);
      }
    };

    return (
      <label className={cn(
        "flex items-center space-x-2 cursor-pointer",
        className
      )}>
        <div className="relative">
          <input
            ref={ref}
            type="radio"
            name={context.name}
            value={itemValue}
            checked={isChecked}
            onChange={handleChange}
            className="sr-only"
            {...props}
          />
          <div className={cn(
            "aspect-square h-4 w-4 rounded-full border border-gray-300 ring-offset-white transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            isChecked ? "border-blue-600 bg-blue-600" : "bg-white"
          )}>
            {isChecked && (
              <div className="flex items-center justify-center w-full h-full">
                <Circle className="h-2.5 w-2.5 fill-white text-white" />
              </div>
            )}
          </div>
        </div>
        {children}
      </label>
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
