
import * as React from "react"
import { cn } from "@/lib/utils"

// POPOVER NATIVO - SEM RADIX UI
const Popover = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & { children: React.ReactNode }
>(({ children, className, ...props }, ref) => (
  <div ref={ref} className={cn("relative inline-block", className)} {...props}>
    {children}
  </div>
))
Popover.displayName = "Popover"

const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={className}
    {...props}
  />
))
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
))
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }
