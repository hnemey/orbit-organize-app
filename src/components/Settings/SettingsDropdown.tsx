
import React, { useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import GoogleCalendarIntegration from '../GoogleCalendarIntegration';

interface SettingsDropdownProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

const SettingsDropdown: React.FC<SettingsDropdownProps> = ({
  isDarkMode,
  onThemeToggle,
}) => {
  const [isCalendarDialogOpen, setIsCalendarDialogOpen] = useState(false);

  const handleOutlookConnect = () => {
    alert('Outlook Calendar integration coming soon!');
  };

  const handleAppleCalendarConnect = () => {
    alert('Apple Calendar integration coming soon!');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-white hover:bg-gray-700 w-10 h-10"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
          <DropdownMenuLabel className="text-gray-900 dark:text-gray-100">
            Settings
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <div className="px-2 py-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Dark Mode
              </span>
              <Switch
                checked={isDarkMode}
                onCheckedChange={onThemeToggle}
              />
            </div>
          </div>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel className="text-gray-900 dark:text-gray-100">
            Connect Calendars
          </DropdownMenuLabel>
          
          <DropdownMenuItem 
            onClick={() => setIsCalendarDialogOpen(true)}
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Google Calendar</span>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={handleOutlookConnect}
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span>Outlook Calendar</span>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={handleAppleCalendarConnect}
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-600 rounded"></div>
              <span>Apple Calendar</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isCalendarDialogOpen} onOpenChange={setIsCalendarDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Google Calendar Integration</DialogTitle>
          </DialogHeader>
          <GoogleCalendarIntegration />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SettingsDropdown;
