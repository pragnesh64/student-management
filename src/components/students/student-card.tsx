'use client'

import { Database } from '@/lib/supabase/database.types'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Mail, Phone, Calendar, GraduationCap } from 'lucide-react'
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      case 'graduated':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'withdrawn':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="border rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow bg-card">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold">
            {student.first_name} {student.last_name}
          </h3>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(student.status)}`}>
            {student.status}
          </span>
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

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>{student.email}</span>
        </div>
        {student.phone && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{student.phone}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>DOB: {new Date(student.date_of_birth).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <GraduationCap className="h-4 w-4" />
          <span>{student.grade_level}</span>
          {student.major && <span className="ml-2">• {student.major}</span>}
        </div>
        {student.gpa && (
          <div className="text-muted-foreground">
            <span className="font-medium">GPA:</span> {student.gpa.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  )
}
