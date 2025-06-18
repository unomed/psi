
import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

// FALLBACK TEMPORÁRIO - Remover Radix UI até resolver problema React
const TooltipProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & { delayDuration?: number }
>(({ delayDuration = 300, children, ...props }, _ref) => (
  <div {...props}>
    {children}
  </div>
))
TooltipProvider.displayName = "TooltipProvider"

// TOOLTIP SIMPLES sem Radix UI
const Tooltip = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
)

const TooltipTrigger = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
))
TooltipTrigger.displayName = "TooltipTrigger"

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & { sideOffset?: number }
>(({ className, sideOffset = 4, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
