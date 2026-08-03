require('dotenv').config({ path: '../.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const { data } = await supabase
    .from('applications')
    .select('*, jobs!inner(*), profiles!freelancer_id(full_name, phone_number, bio)')
    .limit(1);
  console.log(JSON.stringify(data, null, 2));
}
test();
