import { createClient } from '@/lib/supabase/server'
import StudentsClient from './students-client'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function StudentsPage() {
  // Check if environment variables are available
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Configuration Required</h1>
        <p className="text-muted-foreground mb-4">
          Please configure your Supabase environment variables.
        </p>
        <p className="text-sm text-muted-foreground">
          Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.
        </p>
      </div>
    )
  }

  const supabase = await createClient()

  const { data: students, error } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching students:', error)
  }

  return <StudentsClient initialStudents={students || []} />
}
