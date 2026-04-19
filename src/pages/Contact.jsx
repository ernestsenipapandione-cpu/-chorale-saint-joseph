import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import ContactForm from '../components/ContactForm'
import DonForm from '../components/DonForm'

const Contact = () => {
  const [activeSection, setActiveSection] = useState('accueil')

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-blue-900">
      <Toaster />

      {/* Navbar */}
      <nav className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎵</span>
          <h1 className="text-white font-bold text-xl">Chorale Saint Joseph</h1>
        </div>
        <a href="/login"
          className="bg-secondary text-white px-4 py-2 rounded-xl font-semibold hover:bg-yellow-500 transition">
          Connexion membres
        </a>
      </nav>

      {/* Navigation */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap px-4">
        {[
          { id: 'accueil', label: '🏠 Accueil' },
          { id: 'services', label: '🎵 Services' },
          { id: 'contact', label: '📩 Réserver' },
          { id: 'dons', label: '💝 Faire un don' },
        ].map((section) => (
          <button key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-6 py-2 rounded-xl font-semibold transition ${
              activeSection === section.id
                ? 'bg-secondary text-white'
                : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
            }`}>
            {section.label}
          </button>
        ))}
      </div>

      {/* Accueil */}
      {activeSection === 'accueil' && (
        <div className="text-center text-white py-8 px-6">
          <h2 className="text-4xl font-bold mb-4">🎵 Chorale Saint Joseph</h2>
          <p className="text-xl text-blue-200 mb-2">Une voix, une foi, une harmonie</p>
          <p className="text-blue-300 max-w-lg mx-auto mb-8">
            Disponibles pour vos événements religieux, mariages,
            funérailles et célébrations
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button onClick={() => setActiveSection('contact')}
              className="bg-secondary text-white px-8 py-4 rounded-xl font-semibold hover:bg-yellow-500 transition text-lg">
              📩 Réserver nos services
            </button>
            <button onClick={() => setActiveSection('dons')}
              className="bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition text-lg">
              💝 Faire un don
            </button>
          </div>
        </div>
      )}

      {/* Services */}
      {activeSection === 'services' && (
        <div className="max-w-4xl mx-auto px-6 mb-12">
          <h3 className="text-white text-2xl font-bold text-center mb-6">Nos Services</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '⛪', label: 'Messes' },
              { icon: '💒', label: 'Mariages' },
              { icon: '🕊️', label: 'Funérailles' },
              { icon: '🎤', label: 'Concerts' },
              { icon: '🎉', label: 'Célébrations' },
              { icon: '🎓', label: 'Graduations' },
              { icon: '🙏', label: 'Retraites' },
              { icon: '✨', label: 'Événements spéciaux' },
            ].map((service) => (
              <div key={service.label}
                className="bg-white bg-opacity-10 rounded-2xl p-4 text-center text-white">
                <span className="text-3xl block mb-2">{service.icon}</span>
                <p className="text-sm font-medium">{service.label}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button onClick={() => setActiveSection('contact')}
              className="bg-secondary text-white px-8 py-4 rounded-xl font-semibold hover:bg-yellow-500 transition">
              📩 Réserver maintenant
            </button>
          </div>
        </div>
      )}

      {/* Contact */}
      {activeSection === 'contact' && (
        <div className="max-w-2xl mx-auto px-6 pb-16">
          <ContactForm />
        </div>
      )}

      {/* Dons */}
      {activeSection === 'dons' && (
        <div className="max-w-2xl mx-auto px-6 pb-16">
          <DonForm />
        </div>
      )}

    </div>
  )
}

export default Contact;