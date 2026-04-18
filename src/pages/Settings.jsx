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
      <div className="p-6">

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-primary">⚙️ Paramètres</h2>
          <p className="text-gray-500">Gérez vos préférences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Profil */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold text-primary mb-4">👤 Mon profil</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center">
                <span className="text-3xl">🎵</span>
              </div>
              <div>
                <p className="font-bold text-primary">{user?.email}</p>
                <p className="text-sm text-gray-500">Membre de la chorale</p>
              </div>
            </div>
          </div>

          {/* Mode sombre */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold text-primary mb-4">🎨 Apparence</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-700">
                  {darkMode ? '🌙 Mode sombre' : '☀️ Mode clair'}
                </p>
                <p className="text-sm text-gray-500">
                  {darkMode ? 'Cliquez pour activer le mode clair' : 'Cliquez pour activer le mode sombre'}
                </p>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                  darkMode ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform duration-300 flex items-center justify-center ${
                  darkMode ? 'translate-x-13' : 'translate-x-1'
                }`}>
                  {darkMode ? '🌙' : '☀️'}
                </span>
              </button>
            </div>

            {/* Preview */}
            <div className={`mt-4 rounded-xl p-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}>
              <p className="text-sm font-medium">Aperçu du mode</p>
              <p className="text-xs mt-1 opacity-70">Voici à quoi ressemble le mode sélectionné</p>
            </div>
          </div>

          {/* Changer mot de passe */}
          <div className="bg-white rounded-2xl shadow p-6 md:col-span-2">
            <h3 className="text-xl font-bold text-primary mb-4">🔒 Changer le mot de passe</h3>
            <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition disabled:opacity-50"
                >
                  {loading ? '⏳ Mise à jour...' : '🔒 Mettre à jour le mot de passe'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </Layout>
  )
}

export default Settings