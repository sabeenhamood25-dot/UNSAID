import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export function normalizeConfession(row) {
  const text = row.text || row.content || ''
  const isPrivate = row.is_private != null
    ? !!row.is_private
    : row.visibility === 'private'
  return {
    ...row,
    content: text,
    visibility: isPrivate ? 'private' : 'public',
    is_private: isPrivate,
  }
}
