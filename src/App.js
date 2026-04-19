import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Members from './pages/Members'
import Calendar from './pages/Calendar'
import Chat from './pages/Chat'
import Partitions from './pages/Partitions'
import Live from './pages/Live'
import Contact from './pages/Contact'
import Contacts from './pages/Contacts'
import Finances from './pages/Finances'
import Settings from './pages/Settings'
// 1. On importe la nouvelle page Merci
import Merci from './pages/Merci' 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/members" element={<Members />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/partitions" element={<Partitions />} />
        <Route path="/live" element={<Live />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/finances" element={<Finances />} />
        <Route path="/settings" element={<Settings />} />
        
        {/* 2. On ajoute la route pour le retour de paiement */}
        <Route path="/merci" element={<Merci />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App