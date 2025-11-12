'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Database } from '@/lib/supabase/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import { useState } from 'react'

type Student = Database['public']['Tables']['students']['Row']
type StudentInsert = Database['public']['Tables']['students']['Insert']
type StudentUpdate = Database['public']['Tables']['students']['Update']

const studentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name is too long'),
})

type StudentFormData = z.infer<typeof studentSchema>

interface StudentFormProps {
  student: Student | null
  onSave: (student: Student) => void
  onCancel: () => void
}

export default function StudentForm({ student, onSave, onCancel }: StudentFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: student?.name || '',
    },
  })

  const onSubmit = async (data: StudentFormData) => {
    setIsSubmitting(true)
    const supabase = createClient()

    if (student) {
      // Update existing student
      const updateData: StudentUpdate = {
        name: data.name,
      }

      const { data: updatedStudent, error } = await supabase
        .from('students')
        .update(updateData)
        .eq('id', student.id)
        .select()
        .single()

      if (error) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to update student.',
          variant: 'destructive',
        })
        setIsSubmitting(false)
        return
      }

      toast({
        title: 'Success',
        description: 'Student updated successfully.',
      })
      onSave(updatedStudent)
    } else {
      // Create new student
      const insertData: StudentInsert = {
        name: data.name,
      }

      const { data: newStudent, error } = await supabase
        .from('students')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to create student.',
          variant: 'destructive',
        })
        setIsSubmitting(false)
        return
      }

      toast({
        title: 'Success',
        description: 'Student created successfully.',
      })
      onSave(newStudent)
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input 
            id="name" 
            {...register('name')} 
            placeholder="Enter student name"
            autoFocus
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : student ? 'Update Student' : 'Add Student'}
        </Button>
      </div>
    </form>
  )
}
