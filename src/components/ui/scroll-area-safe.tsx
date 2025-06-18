
import * as React from "react"
import { ScrollArea, ScrollBar } from "./scroll-area"

interface SafeScrollAreaProps extends React.ComponentPropsWithoutRef<typeof ScrollArea> {
  fallback?: React.ReactNode;
}

export const SafeScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollArea>,
  SafeScrollAreaProps
>(({ children, fallback = null, ...props }, ref) => {
  try {
    return (
      <ScrollArea ref={ref} {...props}>
        {children}
      </ScrollArea>
    );
  } catch (error) {
    console.error('ScrollArea error:', error);
    return <div className="overflow-auto">{fallback || children}</div>;
  }
});

SafeScrollArea.displayName = "SafeScrollArea";

export { ScrollBar };
