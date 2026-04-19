import React from 'react'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">
      {/* Sidebar fixe à gauche sur ordi, coulissante sur mobile */}
      <Sidebar />
      
      {/* Contenu principal */}
      <main className="flex-1 w-full relative">
        {/* Espace pour la barre mobile (seulement sur petits écrans) */}
        <div className="h-[60px] md:hidden"></div>
        
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout