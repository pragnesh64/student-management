'use client'

import { useState, useEffect } from 'react'
import { Database } from '@/lib/supabase/database.types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import StudentForm from './student-form'

type Student = Database['public']['Tables']['students']['Row']

interface StudentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  student: Student | null
  onSave: (student: Student) => void
}

export default function StudentDialog({
  open,
  onOpenChange,
  student,
  onSave,
}: StudentDialogProps) {
  const [key, setKey] = useState(0)

  // Reset form when dialog opens/closes or student changes
  useEffect(() => {
    if (open) {
      setKey(prev => prev + 1)
    }
  }, [open, student])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {student ? 'Edit Student' : 'Add New Student'}
          </DialogTitle>
          <DialogDescription>
            {student
              ? 'Update student information below.'
              : 'Fill in the details to add a new student.'}
          </DialogDescription>
        </DialogHeader>
        <StudentForm
          key={key}
          student={student}
          onSave={onSave}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
