require('dotenv').config({ path: '../.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function debug() {
  console.log('Apps:', await supabase.from('applications').select('*'));
  console.log('Contracts:', await supabase.from('contracts').select('*'));
}
debug();
