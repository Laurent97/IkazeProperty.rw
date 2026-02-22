import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { getSupabaseClient } from '@/lib/supabase-client'

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

export const supabase = getSupabaseClient()

// For backward compatibility, export the getter functions with the same names
export const supabaseAdmin = getSupabaseAdmin
export const supabaseAuth = getSupabaseAuth

export const signUp = async (email: string, password: string, fullName: string) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      fullName
    })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Registration failed')
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
  const response = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to send reset email')
  }

  return data
}

export const updatePassword = async (password: string) => {
  // Get current session to get the access token
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.access_token) {
    throw new Error('No active session found. Please log in again.')
  }

  const response = await fetch('/api/auth/update-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`
    },
    body: JSON.stringify({ password })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to update password')
  }

  return data
}

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.ikazeproperty.rw'}/en/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      skipBrowserRedirect: false
    }
  })

  if (error) throw error
  return data
}

export const signInWithMagicLink = async (email: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.ikazeproperty.rw'}/en/auth/callback`
    }
  })

  if (error) throw error
  return data
}

export const changeUserEmail = async (newEmail: string) => {
  const { data, error } = await supabase.auth.updateUser({
    email: newEmail
  })

  if (error) throw error
  return data
}
