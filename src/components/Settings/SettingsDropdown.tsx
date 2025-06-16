
import React from 'react';
import { Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface SettingsDropdownProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

const SettingsDropdown: React.FC<SettingsDropdownProps> = ({
  isDarkMode,
  onThemeToggle,
}) => {
  const handleGoogleCalendarConnect = () => {
    // This will be implemented when Supabase is connected
    alert('Google Calendar integration requires backend setup. Please connect to Supabase first for secure API key management.');
  };

  const handleOutlookConnect = () => {
    // This will be implemented when Supabase is connected
    alert('Outlook Calendar integration requires backend setup. Please connect to Supabase first for secure API key management.');
  };

  const handleAppleCalendarConnect = () => {
    // This will be implemented when Supabase is connected
    alert('Apple Calendar integration requires backend setup. Please connect to Supabase first for secure API key management.');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground hover:bg-accent w-10 h-10 transition-colors duration-200"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-64 bg-popover border border-border shadow-lg"
      >
        <DropdownMenuLabel className="text-popover-foreground">
          Settings
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        
        <div className="px-2 py-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-popover-foreground">
              Dark Mode
            </span>
            <Switch
              checked={isDarkMode}
              onCheckedChange={onThemeToggle}
            />
          </div>
        </div>
        
        <DropdownMenuSeparator className="bg-border" />
        
        <DropdownMenuLabel className="text-popover-foreground">
          Connect Calendars
        </DropdownMenuLabel>
        
        <DropdownMenuItem 
          onClick={handleGoogleCalendarConnect}
          className="text-popover-foreground hover:bg-accent transition-colors duration-200"
        >
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Google Calendar</span>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handleOutlookConnect}
          className="text-popover-foreground hover:bg-accent transition-colors duration-200"
        >
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span>Outlook Calendar</span>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handleAppleCalendarConnect}
          className="text-popover-foreground hover:bg-accent transition-colors duration-200"
        >
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-slate-600 rounded"></div>
            <span>Apple Calendar</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SettingsDropdown;
