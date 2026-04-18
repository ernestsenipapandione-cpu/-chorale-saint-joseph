import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../supabase/client'
import { checkIsAdmin } from '../supabase/admin'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [isOpen, setIsOpen] = useState(false) // Pour le menu mobile
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminInfo, setAdminInfo] = useState(null)

  useEffect(() => {
    const getAdmin = async () => {
      const admin = await checkIsAdmin()
      setIsAdmin(admin)
      if (admin) {
        const { data: { user } } = await supabase.auth.getUser()
        const { data } = await supabase
          .from('admins')
          .select('*')
          .eq('email', user.email)
          .single()
        setAdminInfo(data)
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
      {/* BARRE MOBILE (Visible uniquement sur petit écran) */}
      <div className="md:hidden bg-primary text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎵</span>
          <span className="font-bold text-sm">St Joseph</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-blue-800 rounded-lg"
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* SIDEBAR PRINCIPALE */}
      <div className={`
        bg-primary text-white transition-all duration-300 flex flex-col z-40
        /* Sur Mobile: position absolue, cachée ou affichée selon isOpen */
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed inset-y-0 left-0 w-64 md:relative md:translate-x-0
        /* Sur PC: largeur selon collapsed */
        ${collapsed ? 'md:w-20' : 'md:w-64'} 
        md:min-h-screen
      `}>

        {/* Logo (Caché sur mobile car déjà dans la barre mobile) */}
        <div className="hidden md:flex p-4 items-center justify-between border-b border-blue-800">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎵</span>
              <span className="font-bold text-sm">Chorale St Joseph</span>
            </div>
          )}
          {collapsed && <span className="text-2xl mx-auto">🎵</span>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white hover:text-secondary transition ml-auto"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Admin Badge */}
        {isAdmin && (
          <div className={`mx-4 mt-3 bg-secondary rounded-xl px-3 py-2 text-center ${collapsed ? 'hidden md:block md:opacity-0' : 'block'}`}>
            <p className="text-xs font-bold truncate">👑 {adminInfo?.nom || 'Admin'}</p>
          </div>
        )}

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            if (item.adminOnly && !isAdmin) return null
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path)
                  setIsOpen(false) // Ferme le menu sur mobile après clic
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition duration-200 
                  ${location.pathname === item.path
                    ? 'bg-secondary text-white'
                    : 'hover:bg-blue-800 text-white'
                  }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className={`text-sm font-medium ${collapsed ? 'md:hidden' : 'block'}`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </nav>

        {/* Déconnexion */}
        <div className="p-4 border-t border-blue-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-600 transition duration-200"
          >
            <span className="text-xl">🚪</span>
            <span className={`text-sm font-medium ${collapsed ? 'md:hidden' : 'block'}`}>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Overlay pour fermer le menu mobile en cliquant à côté */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  )
}

export default Sidebar