import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Upload, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const navItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: BarChart3,
      description: 'Vista general del progreso'
    },
    {
      title: 'Subir datos',
      href: '/dashboard/upload',
      icon: Upload,
      description: 'Sube tus archivos de Excel'
    },
  ];

  return (
    <aside 
      className={cn(
        "fixed left-0 top-[73px] h-[calc(100vh-73px)] bg-sidebar-bg border-r border-border transition-all duration-300 z-40",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full justify-center mb-4"
        >
          {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </Button>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/dashboard'}
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-lg transition-all duration-200 group",
                  "hover:bg-primary/10 hover:shadow-sm",
                  collapsed ? "p-3 justify-center" : "p-3",
                  isActive
                    ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary border-r-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              <item.icon className={cn("flex-shrink-0", collapsed ? "h-5 w-5" : "h-5 w-5 mr-3")} />
              {!collapsed && (
                <div className="flex-1">
                  <div className="font-medium text-sm">{item.title}</div>
                  <div className="text-xs text-muted-foreground group-hover:text-foreground/80">
                    {item.description}
                  </div>
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;