
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  FileText, 
  History, 
  AlertTriangle, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useEmployeeAuthNative } from "@/contexts/EmployeeAuthNative";

interface EmployeeModernSidebarProps {
  currentView: string;
  onViewChange: (view: 'dashboard' | 'assessments' | 'history' | 'symptoms') => void;
  employeeName: string;
  hasNewAssessment?: boolean;
}

export function EmployeeModernSidebar({ 
  currentView, 
  onViewChange, 
  employeeName,
  hasNewAssessment = false
}: EmployeeModernSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useEmployeeAuthNative();

  const handleLogout = () => {
    logout();
    window.location.href = "/auth/employee";
  };

  const menuItems = [
    {
      id: 'dashboard' as const,
      label: 'Início',
      icon: Home
    },
    {
      id: 'assessments' as const,
      label: 'Avaliações',
      icon: FileText,
      badge: hasNewAssessment ? 'Nova' : undefined
    },
    {
      id: 'history' as const,
      label: 'Histórico',
      icon: History
    },
    {
      id: 'symptoms' as const,
      label: 'Orientações',
      icon: AlertTriangle
    }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Portal</h2>
        <p className="text-sm text-gray-600 truncate">{employeeName}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <li key={item.id}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    isActive 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    onViewChange(item.id);
                    setIsOpen(false);
                  }}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className="bg-red-100 text-red-800 text-xs ml-2"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-700 hover:bg-gray-100"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50 bg-white"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative
        inset-y-0 left-0
        w-64 bg-white border-r border-gray-200
        transform transition-transform duration-200 ease-in-out
        z-50 md:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden absolute top-4 right-4"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>

        <SidebarContent />
      </div>
    </>
  );
}
