import { supabase } from './client'

export const checkIsAdmin = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data, error } = await supabase
    .from('membres')
    .select('*')
    .eq('Email', user.email)
    .single()

  if (error || !data) return false
  return data.Roles === 'Admin'
}

export const getAdminInfo = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('membres')
    .select('*')
    .eq('Email', user.email)
    .single()

  if (error || !data) return null
  return data
}