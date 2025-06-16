
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Home, 
  ClipboardList, 
  History, 
  Heart, 
  Menu, 
  X,
  Activity,
  LogOut
} from "lucide-react";
import { useEmployeeAuth } from "@/hooks/useEmployeeAuth";

interface EmployeeModernSidebarProps {
  currentView: string;
  onViewChange: (view: 'dashboard' | 'assessments' | 'history' | 'symptoms') => void;
  employeeName: string;
}

export function EmployeeModernSidebar({ currentView, onViewChange, employeeName }: EmployeeModernSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useEmployeeAuth();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      description: 'Visão geral'
    },
    {
      id: 'assessments',
      label: 'Avaliações',
      icon: ClipboardList,
      description: 'Agendadas'
    },
    {
      id: 'history',
      label: 'Histórico',
      icon: History,
      description: 'Respondidas'
    },
    {
      id: 'symptoms',
      label: 'Saúde e Sintomas',
      icon: Activity,
      description: 'Orientações'
    }
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden bg-white text-gray-900 border border-gray-200 hover:bg-gray-100"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed md:relative left-0 top-0 z-40 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Portal Funcionário</h2>
              <p className="text-sm text-gray-500 truncate">{employeeName}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-auto p-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                  isActive && "bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                )}
                onClick={() => {
                  onViewChange(item.id as any);
                  setIsOpen(false);
                }}
              >
                <Icon className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className={cn(
                    "text-xs",
                    isActive ? "text-blue-100" : "text-gray-500"
                  )}>{item.description}</div>
                </div>
              </Button>
            );
          })}
        </nav>

        {/* Footer com botão de logout */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start h-auto p-3 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Sair</div>
              <div className="text-xs text-red-400">Fazer logout</div>
            </div>
          </Button>
          
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>Unomed - Cuidando da sua saúde</p>
            <p className="mt-1">Versão 1.0</p>
          </div>
        </div>
      </div>
    </>
  );
}
