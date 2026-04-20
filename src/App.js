import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importation des pages (Vérifie bien que ces fichiers existent dans ton dossier src/pages)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Calendar from './pages/Calendar';
import Partitions from './pages/Partitions';
import Live from './pages/Live';
import Finances from './pages/Finances';
import Contacts from './pages/Contacts';
import Settings from './pages/Settings';
import Contact from './pages/Contact'; // La page d'accueil public
import Merci from './pages/Merci';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes Publiques */}
        <Route path="/" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/merci" element={<Merci />} />

        {/* Routes du Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/members" element={<Members />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/partitions" element={<Partitions />} />
        <Route path="/live" element={<Live />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/finances" element={<Finances />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; // <-- CETTE LIGNE EST OBLIGATOIRE