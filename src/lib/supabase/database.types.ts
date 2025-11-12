export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          date_of_birth: string
          enrollment_date: string
          grade_level: string
          major: string | null
          gpa: number | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          status: 'active' | 'inactive' | 'graduated' | 'withdrawn'
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          date_of_birth: string
          enrollment_date: string
          grade_level: string
          major?: string | null
          gpa?: number | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          status?: 'active' | 'inactive' | 'graduated' | 'withdrawn'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          date_of_birth?: string
          enrollment_date?: string
          grade_level?: string
          major?: string | null
          gpa?: number | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          status?: 'active' | 'inactive' | 'graduated' | 'withdrawn'
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
