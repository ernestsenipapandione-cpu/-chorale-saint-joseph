import React, { useState } from 'react'
import { supabase } from '../supabase/client'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    // 1. Connexion à l'Auth de Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(), // On nettoie l'email
      password,
    })

    if (authError) {
      toast.error('Email ou mot de passe incorrect !')
      setLoading(false)
      return
    }

    // 2. Vérification dans la table 'membres'
    // On a supprimé la table 'admins', donc on ne cherche QUE dans 'membres'
    const { data: membreData, error: dbError } = await supabase
      .from('membres')
      .select('email, role')
      .eq('email', email.trim().toLowerCase())
      .single()

    if (dbError || !membreData) {
      console.log("Erreur DB:", dbError)
      await supabase.auth.signOut()
      toast.error("Accès refusé ! Votre email n'est pas enregistré dans la liste des membres.")
    } else {
      toast.success('Connexion réussie !')
      navigate('/dashboard')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-blue-900 flex items-center justify-center p-4">
      <Toaster />
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-primary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🎵</span>
          </div>
          <h1 className="text-2xl font-bold text-primary">Chorale Saint Joseph</h1>
          <p className="text-gray-500 mt-1">Espace sécurisé</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Vérification...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login