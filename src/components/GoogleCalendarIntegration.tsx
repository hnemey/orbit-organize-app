
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Calendar, ExternalLink } from 'lucide-react';

interface GoogleCalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
}

const GoogleCalendarIntegration: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have a stored access token
    const storedToken = localStorage.getItem('google_calendar_token');
    if (storedToken) {
      setAccessToken(storedToken);
      setIsConnected(true);
      fetchEvents(storedToken);
    }
  }, []);

  const connectToGoogle = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('google-calendar', {
        body: { action: 'getAuthUrl' }
      });

      if (error) throw error;

      if (data?.authUrl) {
        // Open Google OAuth in a new window
        window.open(data.authUrl, 'google-auth', 'width=500,height=600');
        
        toast({
          title: "Redirecting to Google",
          description: "Please authorize calendar access in the popup window",
        });
      }
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Google Calendar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvents = async (token: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('google-calendar', {
        body: { 
          action: 'listEvents',
          accessToken: token
        }
      });

      if (error) throw error;

      if (data?.items) {
        setEvents(data.items);
        toast({
          title: "Events Loaded",
          description: `Loaded ${data.items.length} upcoming events`,
        });
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Failed to Load Events",
        description: "Could not fetch calendar events. Please try reconnecting.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    localStorage.removeItem('google_calendar_token');
    setAccessToken(null);
    setIsConnected(false);
    setEvents([]);
    
    toast({
      title: "Disconnected",
      description: "Google Calendar has been disconnected",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-white">Google Calendar</h3>
        </div>
        
        {isConnected ? (
          <Button onClick={disconnect} variant="outline" size="sm">
            Disconnect
          </Button>
        ) : (
          <Button 
            onClick={connectToGoogle} 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Connecting...' : 'Connect'}
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      {isConnected && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-white">Upcoming Events</h4>
            <Button 
              onClick={() => accessToken && fetchEvents(accessToken)} 
              variant="ghost" 
              size="sm"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
          
          {events.length > 0 ? (
            <div className="space-y-2">
              {events.slice(0, 5).map((event) => (
                <div key={event.id} className="bg-gray-700 rounded p-3">
                  <div className="font-medium text-white">{event.summary}</div>
                  <div className="text-sm text-gray-400">
                    {event.start.dateTime ? 
                      new Date(event.start.dateTime).toLocaleString() :
                      event.start.date ? new Date(event.start.date).toLocaleDateString() : 'No date'
                    }
                  </div>
                </div>
              ))}
              {events.length > 5 && (
                <div className="text-sm text-gray-400 text-center">
                  +{events.length - 5} more events
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-400 text-center py-4">
              No upcoming events found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GoogleCalendarIntegration;
