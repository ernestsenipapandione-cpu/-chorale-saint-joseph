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
            const { data } = await supabase
              .from('admins')
              .select('*')
              .eq('email', user.email)
              .single()
            setAdminInfo(data)
          }
        } catch (err) {
          console.error("Erreur admin info:", err)
        }
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
      {/* BARRE MOBILE (Z-index maximum) */}
      <div className="md:hidden bg-primary text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-[200] h-[70px] shadow-xl">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎵</span>
          <span className="font-bold text-sm uppercase tracking-wider">St Joseph</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-blue-700 rounded-lg active:scale-95 transition-transform"
        >
          <span className="text-2xl font-mono">{isOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* SIDEBAR */}
      <div className={`
        bg-primary text-white transition-all duration-300 flex flex-col
        fixed inset-y-0 left-0 w-72 md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        ${collapsed ? 'md:w-20' : 'md:w-64'} 
        z-[150] h-screen
      `}>

        {/* CONTENU SCROLLABLE */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Logo (PC seulement) */}
          <div className="hidden md:flex p-6 items-center justify-between border-b border-white/10 shrink-0">
            {!collapsed && <span className="font-bold">Chorale St Joseph</span>}
            <button onClick={() => setCollapsed(!collapsed)} className="ml-auto">
              {collapsed ? '→' : '←'}
            </button>
          </div>

          {/* ZONE DE MENU */}
          <nav className="flex-1 overflow-y-auto px-4">
            {/* MARGE DE SÉCURITÉ POUR MOBILE PORTRAIT */}
            <div className="h-[90px] md:hidden"></div>

            {isAdmin && (
              <div className={`mb-6 bg-blue-800/50 rounded-xl p-3 text-center ${collapsed ? 'md:hidden' : ''}`}>
                <p className="text-xs font-bold truncate">👑 {adminInfo?.nom || 'Admin'}</p>
              </div>
            )}

            <div className="space-y-2 pb-10">
              {menuItems.map((item) => {
                if (item.adminOnly && !isAdmin) return null
                const isActive = location.pathname === item.path
                
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all
                      ${isActive
                        ? 'bg-secondary text-white shadow-lg scale-[1.02]'
                        : 'hover:bg-white/5 text-white/70'
                      }`}
                  >
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <span className={`font-medium ${collapsed ? 'md:hidden' : 'block'}`}>
                      {item.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </nav>
        </div>

        {/* PIED DE MENU (Déconnexion) */}
        <div className="p-4 border-t border-white/10 bg-primary shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-red-500/20 text-red-400 transition-colors"
          >
            <span className="text-2xl">🚪</span>
            <span className={`${collapsed ? 'md:hidden' : 'block'} font-medium`}>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-[140] md:hidden backdrop-blur-md"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  )
}

export default Sidebar