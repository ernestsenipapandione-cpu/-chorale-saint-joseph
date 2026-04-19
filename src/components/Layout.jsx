import React from 'react'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar /> {/* Appel UNIQUE ici */}
      <main className="flex-1 w-full relative">
        <div className="md:pt-0 pt-[60px]"> {/* Espace pour la barre mobile */}
          {children}
        </div>
      </main>
    </div>
  )
}
export default Layout;