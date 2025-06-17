
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import React from "react"

export function Toaster() {
  // Enhanced safety check - don't render if React isn't fully initialized
  if (typeof React === 'undefined' || !React.useState || !React.useEffect) {
    console.warn('[Toaster] React not fully initialized, skipping render');
    return null;
  }

  // Additional safety check for the hook
  let toasts;
  try {
    const toastHook = useToast();
    toasts = toastHook.toasts;
  } catch (error) {
    console.warn('[Toaster] useToast hook not available:', error);
    return null;
  }

  // Safely handle cases where toasts might not be available
  if (!toasts || !Array.isArray(toasts)) {
    return null;
  }

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
