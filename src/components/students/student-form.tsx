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

const studentSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address').max(255),
  phone: z.string().max(20).optional().or(z.literal('')),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  enrollment_date: z.string().min(1, 'Enrollment date is required'),
  grade_level: z.string().min(1, 'Grade level is required').max(50),
  major: z.string().max(100).optional().or(z.literal('')),
  gpa: z.string()
    .optional()
    .refine((val) => {
      if (!val || val === '') return true
      const num = parseFloat(val)
      return !isNaN(num) && num >= 0 && num <= 4
    }, 'GPA must be between 0 and 4'),
  address: z.string().optional().or(z.literal('')),
  city: z.string().max(100).optional().or(z.literal('')),
  state: z.string().max(50).optional().or(z.literal('')),
  zip_code: z.string().max(10).optional().or(z.literal('')),
  emergency_contact_name: z.string().max(200).optional().or(z.literal('')),
  emergency_contact_phone: z.string().max(20).optional().or(z.literal('')),
  status: z.enum(['active', 'inactive', 'graduated', 'withdrawn']),
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
    defaultValues: student
      ? {
          ...student,
          phone: student.phone || '',
          major: student.major || '',
          gpa: student.gpa?.toString() || '',
          address: student.address || '',
          city: student.city || '',
          state: student.state || '',
          zip_code: student.zip_code || '',
          emergency_contact_name: student.emergency_contact_name || '',
          emergency_contact_phone: student.emergency_contact_phone || '',
        }
      : {
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          date_of_birth: '',
          enrollment_date: new Date().toISOString().split('T')[0],
          grade_level: '',
          major: '',
          gpa: '',
          address: '',
          city: '',
          state: '',
          zip_code: '',
          emergency_contact_name: '',
          emergency_contact_phone: '',
          status: 'active',
        },
  })

  const onSubmit = async (data: StudentFormData) => {
    setIsSubmitting(true)
    const supabase = createClient()

    const studentData: StudentInsert = {
      ...data,
      phone: data.phone || null,
      major: data.major || null,
      gpa: data.gpa ? parseFloat(data.gpa) : null,
      address: data.address || null,
      city: data.city || null,
      state: data.state || null,
      zip_code: data.zip_code || null,
      emergency_contact_name: data.emergency_contact_name || null,
      emergency_contact_phone: data.emergency_contact_phone || null,
    }

    if (student) {
      // Update existing student
      const { data: updatedStudent, error } = await supabase
        .from('students')
        .update(studentData)
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
      const { data: newStudent, error } = await supabase
        .from('students')
        .insert(studentData)
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
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name *</Label>
            <Input id="first_name" {...register('first_name')} />
            {errors.first_name && (
              <p className="text-sm text-destructive">{errors.first_name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name *</Label>
            <Input id="last_name" {...register('last_name')} />
            {errors.last_name && (
              <p className="text-sm text-destructive">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register('phone')} />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth *</Label>
            <Input id="date_of_birth" type="date" {...register('date_of_birth')} />
            {errors.date_of_birth && (
              <p className="text-sm text-destructive">{errors.date_of_birth.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Academic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="enrollment_date">Enrollment Date *</Label>
            <Input id="enrollment_date" type="date" {...register('enrollment_date')} />
            {errors.enrollment_date && (
              <p className="text-sm text-destructive">{errors.enrollment_date.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="grade_level">Grade Level *</Label>
            <Input id="grade_level" {...register('grade_level')} placeholder="e.g., 10th Grade, Sophomore" />
            {errors.grade_level && (
              <p className="text-sm text-destructive">{errors.grade_level.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="major">Major</Label>
            <Input id="major" {...register('major')} placeholder="e.g., Computer Science" />
            {errors.major && (
              <p className="text-sm text-destructive">{errors.major.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="gpa">GPA</Label>
            <Input
              id="gpa"
              type="number"
              step="0.01"
              min="0"
              max="4"
              {...register('gpa')}
              placeholder="0.00 - 4.00"
            />
            {errors.gpa && (
              <p className="text-sm text-destructive">{errors.gpa.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <select
            id="status"
            {...register('status')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="graduated">Graduated</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
          {errors.status && (
            <p className="text-sm text-destructive">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* Address Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Address Information</h3>
        <div className="space-y-2">
          <Label htmlFor="address">Street Address</Label>
          <Input id="address" {...register('address')} />
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address.message}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" {...register('city')} />
            {errors.city && (
              <p className="text-sm text-destructive">{errors.city.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input id="state" {...register('state')} />
            {errors.state && (
              <p className="text-sm text-destructive">{errors.state.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="zip_code">Zip Code</Label>
            <Input id="zip_code" {...register('zip_code')} />
            {errors.zip_code && (
              <p className="text-sm text-destructive">{errors.zip_code.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Emergency Contact</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergency_contact_name">Contact Name</Label>
            <Input id="emergency_contact_name" {...register('emergency_contact_name')} />
            {errors.emergency_contact_name && (
              <p className="text-sm text-destructive">{errors.emergency_contact_name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergency_contact_phone">Contact Phone</Label>
            <Input id="emergency_contact_phone" {...register('emergency_contact_phone')} />
            {errors.emergency_contact_phone && (
              <p className="text-sm text-destructive">{errors.emergency_contact_phone.message}</p>
            )}
          </div>
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
