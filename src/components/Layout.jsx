import React from 'react'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
  return (
    // On passe de "flex" (côte à côte) à "flex-col" (l'un sur l'autre) par défaut
    // et "md:flex-row" (côte à côte) seulement sur ordinateur
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}

export default Layout