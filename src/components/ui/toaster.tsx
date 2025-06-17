
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
  // Multiple safety layers to prevent hook errors
  const [isMounted, setIsMounted] = React.useState(false);
  const [toasts, setToasts] = React.useState<any[]>([]);
  
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isMounted) return;

    try {
      const toastHook = useToast();
      if (toastHook && Array.isArray(toastHook.toasts)) {
        setToasts(toastHook.toasts);
      }
    } catch (error) {
      console.warn('[Toaster] useToast hook error, using fallback:', error);
      // Use simple fallback toast system
      if (typeof window !== 'undefined' && (window as any).showSimpleToast) {
        // Already setup in error boundary
      }
    }
  }, [isMounted]);

  // Don't render until component is mounted and React is stable
  if (!isMounted) {
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
