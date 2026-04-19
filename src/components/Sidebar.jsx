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
      {/* BARRE MOBILE (Fixe en haut) */}
      <div className="md:hidden bg-primary text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-[110] shadow-lg h-[70px]">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎵</span>
          <span className="font-bold text-sm">St Joseph</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-blue-800 rounded-lg active:bg-blue-700"
        >
          <span className="text-2xl">{isOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* SIDEBAR */}
      <div className={`
        bg-primary text-white transition-all duration-300 flex flex-col
        fixed inset-y-0 left-0 w-64 md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        ${collapsed ? 'md:w-20' : 'md:w-64'} 
        z-[100] h-full
      `}>

        {/* Logo (PC uniquement) */}
        <div className="hidden md:flex p-4 items-center justify-between border-b border-blue-800">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎵</span>
              <span className="font-bold text-sm text-white">Chorale St Joseph</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white hover:text-secondary ml-auto"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Menu avec protection pour le mobile */}
        <nav className={`
          flex-1 p-4 space-y-2 overflow-y-auto
          ${isOpen ? 'pt-[80px]' : 'pt-4'} 
          md:pt-4
        `}>
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
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all
                  ${isActive
                    ? 'bg-secondary text-white shadow-md'
                    : 'hover:bg-blue-800 text-white/90 hover:text-white'
                  }`}
              >
                <span className="text-xl shrink-0">{item.icon}</span>
                <span className={`text-sm font-medium whitespace-nowrap ${collapsed ? 'md:hidden' : 'block'}`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </nav>

        {/* Déconnexion */}
        <div className="p-4 border-t border-blue-800 bg-primary">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-600 transition-colors"
          >
            <span className="text-xl shrink-0">🚪</span>
            <span className={`text-sm font-medium ${collapsed ? 'md:hidden' : 'block'}`}>
              Déconnexion
            </span>
          </button>
        </div>
      </div>

      {/* Overlay Sombre */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[90] md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  )
}

export default Sidebar