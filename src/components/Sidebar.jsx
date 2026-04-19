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
      {/* 1. BARRE MOBILE : Elle disparaît quand le menu est ouvert pour laisser de la place */}
      {!isOpen && (
        <div className="md:hidden bg-primary text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-[100] h-[60px]">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎵</span>
            <span className="font-bold">St Joseph</span>
          </div>
          <button onClick={() => setIsOpen(true)} className="p-2 bg-blue-800 rounded-lg">
            <span className="text-2xl">☰</span>
          </button>
        </div>
      )}

      {/* 2. LE MENU PLEIN ÉCRAN SUR MOBILE */}
      <div className={`
        fixed inset-0 z-[200] transition-all duration-300 md:relative md:translate-x-0
        ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible md:visible md:opacity-100'}
        flex flex-col bg-primary text-white w-full md:w-${collapsed ? '20' : '64'} h-[100dvh]
      `}>
        
        {/* EN-TÊTE DU MENU OUVERT (Mobile et PC) */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎵</span>
            {(!collapsed || isOpen) && <span className="font-bold tracking-tight">Chorale St Joseph</span>}
          </div>
          
          {/* Bouton pour FERMER sur mobile ou RÉDUIRE sur PC */}
          <button 
            onClick={() => isOpen ? setIsOpen(false) : setCollapsed(!collapsed)} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <span className="text-2xl leading-none">
              {isOpen ? '✕' : (collapsed ? '→' : '←')}
            </span>
          </button>
        </div>

        {/* LISTE DES MENUS (Scrollable) */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {isAdmin && (
            <div className="mb-6 bg-secondary/20 rounded-2xl p-4 text-center">
              <p className="text-[10px] font-bold uppercase text-secondary mb-1">Espace Admin</p>
              <p className="text-sm font-semibold truncate">{adminInfo?.nom}</p>
            </div>
          )}

          {menuItems.map((item) => {
            if (item.adminOnly && !isAdmin) return null
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setIsOpen(false); }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all
                  ${isActive ? 'bg-secondary text-white shadow-xl scale-[1.02]' : 'hover:bg-white/5 text-white/60'}
                `}
              >
                <span className="text-2xl shrink-0">{item.icon}</span>
                <span className={`text-base font-semibold ${collapsed && !isOpen ? 'md:hidden' : 'block'}`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </nav>

        {/* PIED DE PAGE (Déconnexion) */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-red-500/20 text-red-400"
          >
            <span className="text-2xl">🚪</span>
            <span className={`${collapsed && !isOpen ? 'md:hidden' : 'block'} font-semibold`}>
              Déconnexion
            </span>
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar