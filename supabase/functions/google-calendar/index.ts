
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CalendarEvent {
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, accessToken, calendarId = 'primary', event } = await req.json();
    
    console.log('Google Calendar request:', { action, calendarId });

    switch (action) {
      case 'listEvents':
        const eventsResponse = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?timeMin=${new Date().toISOString()}&maxResults=50&singleEvents=true&orderBy=startTime`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        if (!eventsResponse.ok) {
          throw new Error(`Failed to fetch events: ${eventsResponse.statusText}`);
        }
        
        const eventsData = await eventsResponse.json();
        return new Response(JSON.stringify(eventsData), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });

      case 'createEvent':
        const createResponse = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
          }
        );
        
        if (!createResponse.ok) {
          throw new Error(`Failed to create event: ${createResponse.statusText}`);
        }
        
        const createdEvent = await createResponse.json();
        return new Response(JSON.stringify(createdEvent), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });

      case 'getAuthUrl':
        const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
        const redirectUri = Deno.env.get('GOOGLE_REDIRECT_URI') || 'http://localhost:8080/auth/callback';
        
        const authUrl = `https://accounts.google.com/o/oauth2/auth?` +
          `client_id=${clientId}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `scope=${encodeURIComponent('https://www.googleapis.com/auth/calendar')}&` +
          `response_type=code&` +
          `access_type=offline&` +
          `prompt=consent`;
        
        return new Response(JSON.stringify({ authUrl }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    }
  } catch (error) {
    console.error('Error in google-calendar function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});
