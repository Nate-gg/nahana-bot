const { createClient } = require('@supabase/supabase-js')

exports.supabase = createClient(process.env.SB_URL, process.env.SB_KEY)
