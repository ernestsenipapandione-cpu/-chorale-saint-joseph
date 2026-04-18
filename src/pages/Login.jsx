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

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error('Email ou mot de passe incorrect !')
    } else {
      const { data: membreData } = await supabase
        .from('membres')
        .select('*')
        .eq('email', email)
        .single()

      const { data: adminData } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .single()

      if (!membreData && !adminData) {
        await supabase.auth.signOut()
        toast.error('Accès refusé ! Vous n\'êtes pas membre de la chorale.')
      } else {
        toast.success('Connexion réussie !')
        navigate('/dashboard')
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-blue-900 flex items-center justify-center p-4">
      <Toaster />
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">

        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="bg-primary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🎵</span>
          </div>
          <h1 className="text-2xl font-bold text-primary">Chorale Saint Joseph</h1>
          <p className="text-gray-500 mt-1">Espace membres</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mt-3">
            <p className="text-yellow-700 text-sm">
              🔒 Accès réservé aux membres de la chorale
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="text-right">
            <a href="/forgot-password" className="text-sm text-primary hover:underline">
              Mot de passe oublié ?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {/* Message bas de page */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Pas encore membre ?
          </p>
          <p className="text-gray-400 text-sm">
            Contactez le chef de chorale pour rejoindre la chorale
          </p>
        </div>

      </div>
    </div>
  )
}

export default Login