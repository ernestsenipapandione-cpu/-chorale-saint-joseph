import React from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Layout from './components/Layout' // Chemin corrigé
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
import Merci from './pages/Merci'

const DashboardLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/merci" element={<Merci />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/partitions" element={<Partitions />} />
          <Route path="/live" element={<Live />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/finances" element={<Finances />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App