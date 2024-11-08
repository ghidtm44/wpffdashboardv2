import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kheqhiyrvkwtuzxeiqre.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoZXFoaXlydmt3dHV6eGVpcXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwNzUzNDgsImV4cCI6MjA0NjY1MTM0OH0.AKjog4bOwDQDseDaiucWxeeGN4AUg53LmgrKZ34fTKU';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});
