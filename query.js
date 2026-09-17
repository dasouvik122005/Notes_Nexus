const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: dept } = await supabase.from('departments').select('id').eq('slug', 'btech-cse').single();
  console.log('Dept ID:', dept.id);
  
  const { data: papers } = await supabase.from('papers').select('*').eq('department_id', dept.id);
  console.log('Papers:', papers);
  
  const { data: mats } = await supabase.from('materials').select('*').eq('department_id', dept.id);
  console.log('Materials:', mats);
}
run();
