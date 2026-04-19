import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'
import Layout from '../components/Layout'
import toast, { Toaster } from 'react-hot-toast'

const Settings = () => {
  const [user, setUser] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    // Vérification du mode sombre au chargement
    const savedMode = localStorage.getItem('darkMode')
    if (savedMode === 'true') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', newMode.toString())
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    toast.success(newMode ? '🌙 Mode sombre activé !' : '☀️ Mode clair activé !')
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas !')
      return
    }
    if (password.length < 6) {
      toast.error('Le mot de passe doit avoir au moins 6 caractères !')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      toast.error('Erreur : ' + error.message)
    } else {
      toast.success('Mot de passe mis à jour !')
      setPassword('')
      setConfirmPassword('')
    }
    setLoading(false)
  }

  return (
    <Layout>
      <Toaster />
      <div className="p-4 md:p-8 transition-colors duration-500">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-primary dark:text-blue-400">⚙️ Paramètres</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Gérez votre compte et vos préférences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Profil */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-black text-primary dark:text-blue-400 mb-6 uppercase tracking-widest text-xs">👤 Mon profil</h3>
            <div className="flex items-center gap-5">
              <div className="bg-primary/10 dark:bg-primary/20 w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
                🎵
              </div>
              <div className="overflow-hidden">
                <p className="font-black text-gray-800 dark:text-white truncate">{user?.email}</p>
                <p className="text-xs font-bold text-blue-500 uppercase tracking-tighter">Administrateur Chorale</p>
              </div>
            </div>
          </div>

          {/* Mode sombre */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-black text-primary dark:text-blue-400 mb-6 uppercase tracking-widest text-xs">🎨 Apparence</h3>
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl">
              <div>
                <p className="font-bold text-gray-700 dark:text-gray-200">
                  Thème visuel
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Passer en mode {darkMode ? 'clair' : 'sombre'}
                </p>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                  darkMode ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-300 flex items-center justify-center text-[10px] ${
                  darkMode ? 'translate-x-7' : 'translate-x-1'
                }`}>
                  {darkMode ? '🌙' : '☀️'}
                </span>
              </button>
            </div>
          </div>

          {/* Changer mot de passe */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 lg:col-span-2">
            <h3 className="text-lg font-black text-primary dark:text-blue-400 mb-6 uppercase tracking-widest text-xs">🔒 Sécurité</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 ml-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary dark:text-white"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 ml-2">
                    Confirmation
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary dark:text-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-800 transition disabled:opacity-50 shadow-lg shadow-blue-100 dark:shadow-none"
              >
                {loading ? '⏳ Mise à jour...' : 'Mettre à jour le mot de passe'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </Layout>
  )
}

export default Settings