const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  console.log('🚀 Setting up database...')

  // Read SQL file
  const sqlPath = path.join(__dirname, 'src/lib/supabase/schema.sql')
  const sql = fs.readFileSync(sqlPath, 'utf8')

  // Split by semicolon to execute each statement separately
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  console.log(`📝 Found ${statements.length} SQL statements to execute`)

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i]
    console.log(`\n▶️  Executing statement ${i + 1}/${statements.length}...`)

    try {
      const { data, error } = await supabase.rpc('exec_sql', { sql: statement + ';' })

      if (error) {
        // Try direct query instead
        const { error: directError } = await supabase.from('_sql').select(statement)

        if (directError) {
          console.error(`❌ Error executing statement ${i + 1}:`, directError.message)
          console.log('Statement:', statement.substring(0, 100) + '...')
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`)
        }
      } else {
        console.log(`✅ Statement ${i + 1} executed successfully`)
      }
    } catch (err) {
      console.error(`❌ Error executing statement ${i + 1}:`, err.message)
    }
  }

  // Verify table was created
  console.log('\n🔍 Verifying table creation...')
  const { data, error } = await supabase.from('students').select('*').limit(1)

  if (error) {
    console.error('❌ Table verification failed:', error.message)
    console.log('\n⚠️  Please run the SQL manually in Supabase Dashboard:')
    console.log('   1. Go to: https://supabase.com/dashboard/project/xkotxakyvkbgdfxsmwrw/editor')
    console.log('   2. Click "SQL Editor" → "New Query"')
    console.log('   3. Copy the contents of src/lib/supabase/schema.sql')
    console.log('   4. Paste and click "Run"')
  } else {
    console.log('✅ Table created successfully!')
    console.log('\n🎉 Database setup complete! You can now use your application.')
  }
}

setupDatabase().catch(console.error)
