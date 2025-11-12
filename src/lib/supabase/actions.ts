'use server'

import { createClient } from './server'
import { revalidatePath } from 'next/cache'
import { Database } from './database.types'

type StudentInsert = Database['public']['Tables']['students']['Insert']
type StudentUpdate = Database['public']['Tables']['students']['Update']

export async function createStudent(data: StudentInsert) {
  const supabase = await createClient()

  const { data: student, error } = await supabase
    .from('students')
    .insert(data)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/students')
  return student
}

export async function updateStudent(id: string, data: StudentUpdate) {
  const supabase = await createClient()

  const { data: student, error } = await supabase
    .from('students')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/students')
  return student
}

export async function deleteStudent(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/students')
}

export async function getStudents() {
  const supabase = await createClient()

  const { data: students, error } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return students
}

export async function getStudent(id: string) {
  const supabase = await createClient()

  const { data: student, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return student
}
