// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fmxarioxotllevjzxruq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGFyaW94b3RsbGV2anp4cnVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMTg1NjAsImV4cCI6MjA2NTY5NDU2MH0.cMJId2d2fa8MIoezddUNn0rt4CWxPqVP6CiTjtmz21M";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);