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
    const fetchUserAndRole = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: memberData, error } = await supabase
          .from('Membres') // 'M' majuscule
          .select('role, nom')
          .eq('email', user.email)
          .single()

        if (!error && memberData) {
          setUserName(memberData.nom)
          // Vérification flexible (accepte admin, Admin, ADMIN)
          if (memberData.role?.toLowerCase() === 'admin') {
            setIsAdmin(true)
          }
        }
      }
    }
    fetchUserAndRole()
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
    { icon: '💰', label: 'Finances', path: '/finances', adminOnly: true },
    { icon: '📩', label: 'Réservations', path: '/contacts', adminOnly: true },
    { icon: '⚙️', label: 'Paramètres', path: '/settings', adminOnly: false },
  ]

  return (
    <>
      {/* Barre Mobile */}
      <div className="md:hidden bg-primary text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-[100] h-[60px]">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎵</span>
          <span className="font-bold">St Joseph</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 bg-blue-800 rounded-lg">
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-[150] bg-primary text-white w-64 transition-transform duration-300 transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col h-screen`}>
        
        <div className="p-6 border-b border-white/10 shrink-0">
          <h1 className="text-xl font-bold">Chorale St Joseph</h1>
          {isAdmin && (
            <span className="text-[10px] bg-secondary text-white px-2 py-1 rounded mt-2 inline-block font-bold">
              ESPACE ADMIN
            </span>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Espace pour mobile */}
          <div className="h-[60px] md:hidden"></div>

          {menuItems.map((item) => {
            if (item.adminOnly && !isAdmin) return null

            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setIsOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive ? 'bg-secondary text-white shadow-lg' : 'hover:bg-white/10 text-white/70'}`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="mb-4 text-xs opacity-60">
             Connecté : <span className="font-bold">{userName || 'Membre'}</span>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-600 text-white transition-colors">
            <span>🚪</span> Déconnexion
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-[140] md:hidden backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
      )}
    </>
  )
}

export default Sidebar