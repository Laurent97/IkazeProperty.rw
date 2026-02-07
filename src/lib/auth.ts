import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { supabaseClient } from './supabase-client'

let _supabaseAdmin: ReturnType<typeof createClient<Database>> | null = null
let _supabaseAuth: ReturnType<typeof createClient<Database>> | null = null

export const getSupabaseAdmin = () => {
  if (!_supabaseAdmin) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
    }

    _supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey)
  }
  return _supabaseAdmin
}

export const getSupabaseAuth = () => {
  if (!_supabaseAuth) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
    }

    _supabaseAuth = createClient<Database>(supabaseUrl, supabaseServiceKey)
  }
  return _supabaseAuth
}

export const supabase = supabaseClient

// For backward compatibility, export the getter functions with the same names
export const supabaseAdmin = getSupabaseAdmin
export const supabaseAuth = getSupabaseAuth

export const signUp = async (email: string, password: string, fullName: string) => {
  const authClient = supabaseAuth()
  const { data, error } = await authClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  })

  if (error) throw error

  // Create user profile
  if (data.user) {
    const { error: profileError } = await (authClient as any)
      .from('users')
      .insert({
        id: data.user.id,
        email: data.user.email!,
        full_name: fullName,
        role: 'user'
      })

    if (profileError) throw profileError
  }

  return data
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for "no rows returned"
    throw error
  }
  return data
}

export const updateUserProfile = async (userId: string, updates: any) => {
  const authClient = supabaseAuth()
  const { data, error } = await (authClient as any)
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email)
  if (error) throw error
}

export const updatePassword = async (password: string) => {
  const { error } = await supabase.auth.updateUser({
    password
  })

  if (error) throw error
}
