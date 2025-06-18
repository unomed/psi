
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useReactStability } from '@/hooks/useReactStability';
import { useIsMobileNative } from '@/hooks/useIsMobileNative';
import type { SidebarContext as SidebarContextType } from "./types";

const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

const SidebarContext = React.createContext<SidebarContextType | null>(null);

export function useSidebarRobust() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    console.warn("useSidebarRobust: Context não encontrado, usando valores padrão");
    // Retornar valores padrão seguros se o contexto não estiver disponível
    return {
      state: 'expanded' as const,
      open: true,
      setOpen: () => {},
      isMobile: false,
      openMobile: false,
      setOpenMobile: () => {},
      toggleSidebar: () => {},
    };
  }
  return context;
}

interface SidebarProviderRobustProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export function SidebarProviderRobust({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: SidebarProviderRobustProps) {
  const { isStable } = useReactStability();
  const isMobile = useIsMobileNative();
  const [openMobile, setOpenMobile] = useState(false);
  const [_open, _setOpen] = useState(defaultOpen);
  
  const open = openProp ?? _open;
  
  const setOpen = useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      if (!isStable) {
        console.warn('[SidebarProviderRobust] React não estável, ignorando setOpen');
        return;
      }

      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
      
      try {
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      } catch (error) {
        console.warn('[SidebarProviderRobust] Erro ao salvar cookie:', error);
      }
    },
    [setOpenProp, open, isStable]
  );

  const toggleSidebar = useCallback(() => {
    if (!isStable) {
      console.warn('[SidebarProviderRobust] React não estável, ignorando toggleSidebar');
      return;
    }

    return isMobile
      ? setOpenMobile((open) => !open)
      : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile, isStable]);

  useEffect(() => {
    if (!isStable) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar, isStable]);

  const state = open ? "expanded" : "collapsed";

  const contextValue = useMemo<SidebarContextType>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  );

  // Se React não está estável, renderizar sem contexto
  if (!isStable) {
    return (
      <div
        style={{
          "--sidebar-width": "16rem",
          "--sidebar-width-icon": "3rem",
          ...style,
        } as React.CSSProperties}
        className={className}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        style={{
          "--sidebar-width": "16rem",
          "--sidebar-width-icon": "3rem",
          ...style,
        } as React.CSSProperties}
        className={className}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}
