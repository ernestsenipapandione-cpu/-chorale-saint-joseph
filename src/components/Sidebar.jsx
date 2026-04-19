import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../supabase/client'
import { checkIsAdmin } from '../supabase/admin'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminInfo, setAdminInfo] = useState(null)

  useEffect(() => {
    const getAdmin = async () => {
      const admin = await checkIsAdmin()
      setIsAdmin(admin)
      if (admin) {
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            const { data } = await supabase.from('admins').select('*').eq('email', user.email).single()
            setAdminInfo(data)
          }
        } catch (err) { console.error(err) }
      }
    }
    getAdmin()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/dashboard', adminOnly: false },
    { icon: '👥', label: 'Membres', path: '/members', adminOnly: false },
    { icon: '📅', label: 'Calendrier', path: '/calendar', adminOnly: false },
    { icon: '🎵', label: 'Partitions', path: '/partitions', adminOnly: false },
    { icon: '💬', label: 'Chat', path: '/chat', adminOnly: false },
    { icon: '🎬', label: 'Répétition Live', path: '/live', adminOnly: false },
    { icon: '📩', label: 'Réservations', path: '/contacts', adminOnly: true },
    { icon: '💰', label: 'Finances', path: '/finances', adminOnly: true },
    { icon: '⚙️', label: 'Paramètres', path: '/settings', adminOnly: false },
  ]

  return (
    <>
      {/* BARRE MOBILE (La bande bleue avec le bouton ☰) */}
      <div className="md:hidden bg-primary text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-[200] h-[60px]">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎵</span>
          <span className="font-bold">St Joseph</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 bg-blue-800 rounded-lg z-[210]"
        >
          {/* La croix s'affiche quand c'est ouvert */}
          <span className="text-2xl font-bold">{isOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* LE MENU QUI COULISSE */}
      <div className={`
        fixed inset-0 z-[150] transition-transform duration-300 md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col bg-primary text-white w-72 md:w-${collapsed ? '20' : '64'} h-screen
      `}>
        
        {/* --- LA CORRECTION EST ICI --- */}
        {/* On crée un espace vide de 80px en haut de la liste UNIQUEMENT sur mobile 
            pour que le Dashboard descende en dessous de la barre bleue */}
        <div className="h-[80px] md:h-0 shrink-0"></div>

        {/* Logo PC (caché sur mobile) */}
        <div className="hidden md:flex p-4 items-center justify-between border-b border-white/10 shrink-0">
          {!collapsed && <span className="font-bold text-sm">Chorale St Joseph</span>}
          <button onClick={() => setCollapsed(!collapsed)} className="ml-auto">
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* LISTE DES MENUS */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {isAdmin && (
            <div className="mb-4 bg-secondary/20 rounded-lg p-2 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">Administrateur</p>
              <p className="text-xs font-bold truncate">{adminInfo?.nom}</p>
            </div>
          )}

          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => {
              if (item.adminOnly && !isAdmin) return null
              const isActive = location.pathname === item.path
              return (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setIsOpen(false); }}
                  className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all
                    ${isActive ? 'bg-secondary text-white shadow-lg' : 'hover:bg-white/10 text-white/70'}
                  `}
                >
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <span className={`text-sm font-bold ${collapsed ? 'md:hidden' : 'block'}`}>
                    {item.label}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* BOUTON DECONNEXION */}
        <div className="p-4 border-t border-white/10 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-red-500/20 text-red-400 transition-colors"
          >
            <span className="text-2xl">🚪</span>
            <span className={`${collapsed ? 'md:hidden' : 'block'} font-bold text-sm`}>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* FOND SOMBRE (Quand le menu est ouvert) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-[140] md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  )
}

export default Sidebar