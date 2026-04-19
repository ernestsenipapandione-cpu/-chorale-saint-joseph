import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../supabase/client'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const checkAccess = async () => {
      // 1. Récupérer l'utilisateur authentifié
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (user) {
        // 2. Chercher ses infos dans la table 'membres' (tout en minuscules désormais)
        const { data: memberData, error: dbError } = await supabase
          .from('membres')
          .select('nom, prenom, role')
          .eq('email', user.email)
          .single()

        if (!dbError && memberData) {
          setUserName(`${memberData.prenom} ${memberData.nom}`)
          // 3. Vérification du rôle admin
          if (memberData.role === 'admin') {
            setIsAdmin(true)
          }
        }
      }
    }
    checkAccess()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  // Configuration du menu
  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/dashboard', adminOnly: false },
    { icon: '👥', label: 'Membres', path: '/members', adminOnly: false },
    { icon: '📅', label: 'Calendrier', path: '/calendar', adminOnly: false },
    { icon: '🎵', label: 'Partitions', path: '/partitions', adminOnly: false },
    { icon: '💰', label: 'Finances', path: '/finances', adminOnly: true },
    { icon: '📩', label: 'Réservations', path: '/contacts', adminOnly: true },
    { icon: '⚙️', label: 'Paramètres', path: '/settings', adminOnly: false },
  ]

  return (
    <>
      {/* BARRE MOBILE (Visible uniquement sur téléphone) */}
      <div className="md:hidden bg-primary text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-[100] h-[60px]">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎶</span>
          <span className="font-bold">St Joseph</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 bg-blue-800 rounded-lg text-xl">
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* SIDEBAR (Desktop & Mobile) */}
      <div className={`
        fixed inset-y-0 left-0 z-[150] bg-primary text-white w-64 transition-transform duration-300 transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative md:translate-x-0 flex flex-col h-screen shadow-2xl
      `}>
        
        {/* En-tête */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold tracking-tight">Chorale St Joseph</h1>
          {isAdmin && (
            <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-secondary text-white uppercase">
              Mode Admin
            </div>
          )}
        </div>

        {/* Liens de navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {/* Espace vide pour ne pas être caché par la barre mobile */}
          <div className="h-[60px] md:hidden"></div>

          {menuItems.map((item) => {
            // Si l'item est réservé aux admins et que l'utilisateur n'est pas admin, on cache
            if (item.adminOnly && !isAdmin) return null

            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setIsOpen(false); }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-secondary text-white shadow-lg border border-white/20' 
                    : 'hover:bg-white/10 text-white/70 hover:text-white'}
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Footer avec Utilisateur & Déconnexion */}
        <div className="p-4 border-t border-white/10 bg-black/10">
          <div className="px-4 mb-4">
            <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest">Utilisateur</p>
            <p className="text-sm font-medium truncate">{userName || 'Chargement...'}</p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <span className="text-xl">🚪</span>
            <span className="text-sm font-bold">Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Overlay pour fermer le menu mobile en cliquant à côté */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[140] md:hidden backdrop-blur-sm" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  )
}

export default Sidebar