import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://db.wmvzcpseefbjyafa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRibXpzY3BzZWVmYmp5YWZhZmEiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MjU1NzIwMCwiZXhwIjoxOTU4MTMzMjAwfQ.example';

export const supabase = createClient(supabaseUrl, supabaseKey);
