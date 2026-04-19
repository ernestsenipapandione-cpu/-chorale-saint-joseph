import React from 'react'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-[100dvh] bg-gray-100 overflow-hidden">
      {/* La Sidebar qui contient ton menu et ton bouton ☰ */}
      <Sidebar />
      
      {/* Zone principale du contenu */}
      <main className="flex-1 w-full relative h-screen overflow-y-auto">
        {/* pt-[70px] : Crée l'espace nécessaire en haut sur mobile 
            pour que le contenu ne soit pas caché par la barre bleue 
        */}
        <div className="pt-[70px] md:pt-0">
          <div className="p-4 md:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Layout