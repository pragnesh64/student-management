'use client'

import { Database } from '@/lib/supabase/database.types'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'

type Student = Database['public']['Tables']['students']['Row']

interface StudentCardProps {
  student: Student
  onEdit: (student: Student) => void
  onDelete: (studentId: string) => void
}

export default function StudentCard({ student, onEdit, onDelete }: StudentCardProps) {
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this student?')) {
      return
    }

    const supabase = createClient()
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', student.id)

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete student. Please try again.',
        variant: 'destructive',
      })
      return
    }

    toast({
      title: 'Success',
      description: 'Student deleted successfully.',
    })
    onDelete(student.id)
  }

  return (
    <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-card">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">
            {student.name}
          </h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(student)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  )
}
