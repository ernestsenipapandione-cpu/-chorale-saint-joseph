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
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: memberData } = await supabase
          .from('membres')
          .select('nom, prenom, role')
          .eq('email', user.email.toLowerCase())
          .single()

        if (memberData) {
          setUserName(`${memberData.prenom} ${memberData.nom}`)
          if (memberData.role?.toLowerCase() === 'admin') setIsAdmin(true)
        }
      }
    }
    checkAccess()
  }, [])

  // LISTE DES MENUS CORRIGÉE (Avec le Live ajouté)
  const menuItems = [
    { icon: '📊', label: ' CA MARCHE', path: '/dashboard', adminOnly: false },
    { icon: '👥', label: 'Membres', path: '/members', adminOnly: false },
    { icon: '📅', label: 'Calendrier', path: '/calendar', adminOnly: false },
    { icon: '🎵', label: 'Partitions', path: '/partitions', adminOnly: false },
    { icon: '🔴', label: 'Répétition Live', path: '/live', adminOnly: false }, // <--- IL EST LÀ !
    { icon: '💰', label: 'Finances', path: '/finances', adminOnly: true },
    { icon: '📩', label: 'Réservations', path: '/contacts', adminOnly: true },
    { icon: '⚙️', label: 'Paramètres', path: '/settings', adminOnly: false },
  ]

  return (
    <>
      {/* 1. BARRE MOBILE (Masquée sur ordi avec md:hidden) */}
      <div className="md:hidden flex bg-[#1e3a8a] text-white p-4 justify-between items-center fixed top-0 left-0 right-0 z-[100] h-[60px]">
        <span className="font-bold">St Joseph</span>
        <button onClick={() => setIsOpen(!isOpen)} className="text-2xl">{isOpen ? '✕' : '☰'}</button>
      </div>

      {/* 2. SIDEBAR (Fixe sur ordi, Coulissante sur mobile) */}
      <div className={`
        fixed inset-y-0 left-0 z-[150] bg-[#1e3a8a] text-white w-64 transition-transform duration-300 transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative md:translate-x-0 flex flex-col h-screen
      `}>
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold italic">Chorale St Joseph</h1>
          {isAdmin && <span className="mt-2 inline-block bg-yellow-600 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Mode Admin</span>}
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            if (item.adminOnly && !isAdmin) return null
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setIsOpen(false); }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-600 shadow-lg font-bold' : 'hover:bg-white/10 text-white/70'}`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10 bg-black/10">
          <p className="text-[10px] text-white/30 uppercase font-bold mb-1">Session active</p>
          <p className="text-xs text-white/80 truncate font-medium">{userName}</p>
          <button onClick={() => { supabase.auth.signOut(); navigate('/login'); }} className="text-red-400 text-[10px] mt-2 font-bold uppercase hover:text-red-300">Déconnexion</button>
        </div>
      </div>

      {/* 3. OVERLAY (Seulement sur mobile) */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-[140] md:hidden" onClick={() => setIsOpen(false)}></div>}
    </>
  )
}

export default Sidebar;