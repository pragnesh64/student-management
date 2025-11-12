'use client'

import { useState } from 'react'
import { Database } from '@/lib/supabase/database.types'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import StudentCard from '@/components/students/student-card'
import StudentDialog from '@/components/students/student-dialog'

type Student = Database['public']['Tables']['students']['Row']

interface StudentsClientProps {
  initialStudents: Student[]
}

export default function StudentsClient({ initialStudents }: StudentsClientProps) {
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  const handleAddStudent = () => {
    setSelectedStudent(null)
    setIsDialogOpen(true)
  }

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student)
    setIsDialogOpen(true)
  }

  const handleDeleteStudent = (studentId: string) => {
    setStudents(students.filter(s => s.id !== studentId))
  }

  const handleSaveStudent = (student: Student) => {
    if (selectedStudent) {
      // Update existing student
      setStudents(students.map(s => s.id === student.id ? student : s))
    } else {
      // Add new student
      setStudents([student, ...students])
    }
    setIsDialogOpen(false)
    setSelectedStudent(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            Manage student records and information
          </p>
        </div>
        <Button onClick={handleAddStudent}>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      {students.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg text-muted-foreground mb-4">
            No students found. Add your first student to get started.
          </p>
          <Button onClick={handleAddStudent}>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Student
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onEdit={handleEditStudent}
              onDelete={handleDeleteStudent}
            />
          ))}
        </div>
      )}

      <StudentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        student={selectedStudent}
        onSave={handleSaveStudent}
      />
    </div>
  )
}
