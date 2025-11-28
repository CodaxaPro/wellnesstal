'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  tenantId: string | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, tenantName: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [tenantId, setTenantId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setTenantId(session?.user?.user_metadata?.tenant_id ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setTenantId(session?.user?.user_metadata?.tenant_id ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, tenantName: string) => {
    // 1. ÖNCE user oluştur
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    })

    if (authError) throw authError
    if (!authData.user) throw new Error('User creation failed')

    // 2. SONRA tenant oluştur (anon key ile, RLS: WITH CHECK (true))
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .insert({ 
        name: tenantName, 
        slug: tenantName.toLowerCase().replace(/\s+/g, '-') 
      })
      .select()
      .single()

    if (tenantError) throw tenantError

    // 3. User metadata'ya tenant_id ekle
    const { error: updateError } = await supabase.auth.updateUser({
      data: { tenant_id: tenant.id }
    })

    if (updateError) throw updateError

    // 4. tenant_users'a ekle
    const { error: linkError } = await supabase.from('tenant_users').insert({
      tenant_id: tenant.id,
      user_id: authData.user.id,
      role: 'owner'
    })

    if (linkError) throw linkError
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, tenantId, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}