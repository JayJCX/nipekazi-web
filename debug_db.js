require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function debug() {
  const {data: apps, error: e1} = await supabase.from('applications').select('*');
  console.log('Apps:', apps, 'Error:', e1);
  const {data: contracts, error: e2} = await supabase.from('contracts').select('*');
  console.log('Contracts:', contracts, 'Error:', e2);
}
debug();
