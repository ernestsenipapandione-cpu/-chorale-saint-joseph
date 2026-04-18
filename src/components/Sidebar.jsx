import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../supabase/client'
import { checkIsAdmin } from '../supabase/admin'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
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
    <div className={`bg-primary min-h-screen text-white transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} flex flex-col`}>

      {/* Logo */}
      <div className="p-4 flex items-center justify-between border-b border-blue-800">
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
      {isAdmin && !collapsed && (
        <div className="mx-4 mt-3 bg-secondary rounded-xl px-3 py-2 text-center">
          <p className="text-xs font-bold">👑 {adminInfo?.nom || 'Admin'}</p>
          <p className="text-xs opacity-75">{adminInfo?.role || 'Administrateur'}</p>
        </div>
      )}

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          if (item.adminOnly && !isAdmin) return null
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition duration-200 
                ${location.pathname === item.path
                  ? 'bg-secondary text-white'
                  : 'hover:bg-blue-800 text-white'
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              {!collapsed && (
                <span className="text-sm font-medium">
                  {item.label}
                  {item.adminOnly && (
                    <span className="ml-2 text-xs bg-secondary px-1 rounded">
                      Admin
                    </span>
                  )}
                </span>
              )}
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
          {!collapsed && <span className="text-sm font-medium">Déconnexion</span>}
        </button>
      </div>

    </div>
  )
}

export default Sidebar