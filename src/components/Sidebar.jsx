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
          .eq('email', user.email.toLowerCase()) // Sécurité minuscule
          .single()

        if (memberData) {
          setUserName(`${memberData.prenom} ${memberData.nom}`)
          if (memberData.role?.toLowerCase() === 'admin') {
            setIsAdmin(true)
          }
        }
      }
    }
    checkAccess()
  }, [])

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
      <div className="md:hidden bg-blue-900 text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-[100]">
        <span className="font-bold">St Joseph</span>
        <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? '✕' : '☰'}</button>
      </div>

      <div className={`fixed inset-y-0 left-0 z-[150] bg-blue-900 text-white w-64 transition-transform duration-300 transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col h-screen`}>
        
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold">Chorale St Joseph</h1>
          {isAdmin && <span className="text-[10px] bg-yellow-600 px-2 py-0.5 rounded mt-2 inline-block">ADMIN</span>}
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="h-12 md:hidden"></div>
          {menuItems.map((item) => {
            if (item.adminOnly && !isAdmin) return null
            const isActive = location.pathname === item.path
            return (
              <button key={item.path} onClick={() => { navigate(item.path); setIsOpen(false); }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all
                ${isActive ? 'bg-blue-700 text-white' : 'hover:bg-white/10 text-white/70'}`}>
                <span>{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/50">{userName}</p>
          <button onClick={async () => { await supabase.auth.signOut(); navigate('/login'); }} className="text-red-400 text-sm mt-2">Déconnexion</button>
        </div>
      </div>
    </>
  )
}

export default Sidebar