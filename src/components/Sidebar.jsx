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

  // J'AI MIS "adminOnly: false" PARTOUT POUR ETRE SUR QUE TU VOIS TOUT PENDANT LES TESTS
  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/dashboard', adminOnly: false },
    { icon: '👥', label: 'Membres', path: '/members', adminOnly: false },
    { icon: '📅', label: 'Calendrier', path: '/calendar', adminOnly: false },
    { icon: '🎵', label: 'Partitions', path: '/partitions', adminOnly: false },
    { icon: '💬', label: 'Chat', path: '/chat', adminOnly: false },
    { icon: '🎬', label: 'Répétition Live', path: '/live', adminOnly: false },
    { icon: '📩', label: 'Réservations', path: '/contacts', adminOnly: false },
    { icon: '💰', label: 'Finances', path: '/finances', adminOnly: false },
    { icon: '⚙️', label: 'Paramètres', path: '/settings', adminOnly: false },
  ]

  return (
    <>
      {/* BARRE MOBILE (Bande bleue) */}
      <div className="md:hidden bg-primary text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-[100] h-[60px]">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎵</span>
          <span className="font-bold text-sm">St Joseph</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 bg-blue-800 rounded-lg text-2xl"
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* MENU SIDEBAR */}
      <div className={`
        fixed inset-0 z-[150] transition-all duration-300 md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col bg-primary text-white w-64 md:w-${collapsed ? '20' : '64'} h-screen
      `}>
        
        {/* HEADER DU MENU (Logo) */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎵</span>
            {(!collapsed || isOpen) && <span className="font-bold text-xs uppercase">Menu Chorale</span>}
          </div>
          <button onClick={() => setCollapsed(!collapsed)} className="hidden md:block">
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* LISTE DES LIENS (SCROLLABLE) */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {/* PETIT ESPACE EN HAUT SUR MOBILE POUR QUE LE DASHBOARD NE SOIT PAS CACHÉ PAR LA BARRE BLEUE */}
          <div className="h-[60px] md:hidden"></div>

          {menuItems.map((item) => {
            // Ici, on vérifie si l'utilisateur peut voir l'élément
            if (item.adminOnly && !isAdmin) return null
            
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setIsOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive ? 'bg-secondary text-white' : 'hover:bg-white/10 text-white/70'}
                `}
              >
                <span className="text-xl shrink-0">{item.icon}</span>
                <span className={`text-sm font-medium ${collapsed && !isOpen ? 'md:hidden' : 'block'}`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </nav>

        {/* DECONNEXION */}
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-600 text-white">
            <span className="text-xl">🚪</span>
            <span className={`${collapsed && !isOpen ? 'md:hidden' : 'block'} text-sm`}>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-[140] md:hidden" onClick={() => setIsOpen(false)}></div>
      )}
    </>
  )
}

export default Sidebar