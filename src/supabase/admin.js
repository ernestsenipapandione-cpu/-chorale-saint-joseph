import { supabase } from './client'

export const checkIsAdmin = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data, error } = await supabase
    .from('Membres') // 'M' majuscule comme ton tableau
    .select('role')
    .eq('email', user.email)
    .single()

  if (error || !data) return false
  
  // On transforme en minuscule pour être sûr que ça marche (admin ou Admin)
  return data.role?.toLowerCase() === 'admin'
}