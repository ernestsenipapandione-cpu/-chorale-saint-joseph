import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../supabase/client'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [isOpen, setIsOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userName, setUserName] = useState('')
  const [isChecking, setIsChecking] = useState(true) // NOUVEAU : Pour éviter le flash "Accès refusé"

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: memberData, error } = await supabase
          .from('membres')
          .select('nom, prenom, role')
          .eq('email', user.email.toLowerCase())
          .single()

        if (!error && memberData) {
          setUserName(`${memberData.prenom} ${memberData.nom}`)
          if (memberData.role?.toLowerCase() === 'admin') {
            setIsAdmin(true)
          }
        }
      }
      setIsChecking(false) // On a fini de vérifier, on libère l'affichage
    }
    checkAccess()
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

  // Si on est en train de vérifier le rôle, on affiche un petit chargement 
  // pour éviter que les pages Admin ne rejettent l'utilisateur par erreur
  if (isChecking) return <div className="w-64 bg-blue-900 h-screen"></div>

  return (
    <>
      {/* BARRE MOBILE : Cachée sur ordinateur (hidden), affichée sur mobile (flex md:hidden) */}
      <div className="flex md:hidden bg-blue-900 text-white p-4 justify-between items-center fixed top-0 left-0 right-0 z-[100] h-[60px]">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎶</span>
          <span className="font-bold">St Joseph</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 bg-blue-800 rounded-lg"
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* SIDEBAR : Menu principal */}
      <div className={`
        fixed inset-y-0 left-0 z-[150] bg-blue-900 text-white w-64 transition-transform duration-300 transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative md:translate-x-0 flex flex-col h-screen shadow-2xl
      `}>
        
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold">Chorale St Joseph</h1>
          {isAdmin && (
            <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-600 text-white uppercase">
              Mode Admin
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {/* Petit espace pour ne pas coller au haut sur mobile */}
          <div className="h-4 md:hidden"></div>

          {menuItems.map((item) => {
            if (item.adminOnly && !isAdmin) return null
            const isActive = location.pathname === item.path
            
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all
                  ${isActive 
                    ? 'bg-blue-700 text-white shadow-lg' 
                    : 'hover:bg-white/10 text-white/70 hover:text-white'}
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10 bg-black/10">
          <p className="text-xs text-white/50 mb-2 truncate">{userName}</p>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-2 py-2 text-red-400 hover:text-red-300 transition-colors"
          >
            <span className="text-sm font-bold">Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Overlay mobile */}
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