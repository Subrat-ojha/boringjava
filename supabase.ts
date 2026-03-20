import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wmvzcpseefbjyafaegvr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtdnpjcHNlZWZianlhZmFlZ3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5Nzk3OTEsImV4cCI6MjA4OTU1NTc5MX0.ZMWL4VbEXqkCefWLrCn6dJwY0wEhBRKIGdxNpTSIi60';

export const supabase = createClient(supabaseUrl, supabaseKey);
