import React, { useState } from 'react';
import { Bell, ChevronDown, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const TopNav = () => {
  const { user, logout } = useAuth();
  const [notifications] = useState([
    { id: 1, message: "New teacher progress report available", time: "2 min ago", unread: true },
    { id: 2, message: "Mathematics assessment completed", time: "1 hour ago", unread: true },
    { id: 3, message: "Weekly summary report generated", time: "3 hours ago", unread: false },
    { id: 4, message: "Data upload validation completed", time: "1 day ago", unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <nav className="bg-nav-bg border-b border-border px-6 py-4 sticky top-0 z-50 shadow-sm bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-lg flex items-center justify-center p-1">
            <img src= "src\assets\logo.png" alt='logo'/>
          </div>
          <h1 className="text-xl font-semibold text-foreground">Medicat Dashboard</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications TO DO
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-popover">
              <div className="px-3 py-2 border-b">
                <h3 className="font-semibold">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex-col items-start p-3 border-b last:border-b-0">
                    <div className="flex items-start justify-between w-full">
                      <p className={`text-sm ${notification.unread ? 'font-medium' : 'text-muted-foreground'}`}>
                        {notification.message}
                      </p>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-primary rounded-full ml-2 mt-1 flex-shrink-0"></div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu> */}

         
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 h-10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium">{user?.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-popover">
              <div className="px-3 py-2 border-b">
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;