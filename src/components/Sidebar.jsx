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
      {/* 1. LA BARRE BLEUE MOBILE (Toujours au-dessus de tout) */}
      <div className="md:hidden bg-primary text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-[200] h-[60px]">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎵</span>
          <span className="font-bold">St Joseph</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 bg-blue-700 rounded-lg">
          <span className="text-2xl">{isOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* 2. LA SIDEBAR (Menu qui coulisse) */}
      <div className={`
        fixed inset-0 z-[150] transition-transform duration-300 md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col bg-primary text-white
        w-64 md:w-${collapsed ? '20' : '64'} h-screen
      `}>
        
        {/* A. EN-TÊTE DU MENU (Logo sur PC, Espace vide sur Mobile) */}
        <div className="shrink-0 h-[60px] flex items-center px-6 border-b border-white/10">
          <div className="hidden md:flex items-center gap-2">
             {!collapsed && <span className="font-bold">Chorale St Joseph</span>}
          </div>
          <button onClick={() => setCollapsed(!collapsed)} className="hidden md:block ml-auto">
            {collapsed ? '→' : '←'}
          </button>
          {/* Sur mobile, cet espace de 60px empêche le Dashboard de se cacher sous la barre bleue */}
          <span className="md:hidden font-bold">Menu</span>
        </div>

        {/* B. CORPS DU MENU (C'est cette partie qui doit défiler) */}
        <div className="flex-1 overflow-y-auto pt-4 pb-4 px-3">
          {isAdmin && (
            <div className="mb-4 bg-blue-800/40 rounded-lg p-2 text-center">
              <p className="text-xs font-bold truncate">👑 {adminInfo?.nom}</p>
            </div>
          )}

          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => {
              if (item.adminOnly && !isAdmin) return null
              const isActive = location.pathname === item.path
              return (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setIsOpen(false); }}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors
                    ${isActive ? 'bg-secondary text-white' : 'hover:bg-white/10 text-white/70'}
                  `}
                >
                  <span className="text-xl shrink-0">{item.icon}</span>
                  <span className={`text-sm font-medium ${collapsed ? 'md:hidden' : 'block'}`}>
                    {item.label}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* C. PIED DU MENU (Déconnexion toujours en bas) */}
        <div className="shrink-0 p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-400"
          >
            <span className="text-xl">🚪</span>
            <span className={`${collapsed ? 'md:hidden' : 'block'}`}>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* 3. L'OVERLAY (Fond noir pour fermer) */}
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