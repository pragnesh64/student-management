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
          name: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
