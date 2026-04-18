import React, { useState } from 'react'
import { supabase } from '../supabase/client'
import toast from 'react-hot-toast'

const ContactForm = () => {
  const [form, setForm] = useState({
    nom: '', email: '', telephone: '',
    type_evenement: '', date_evenement: '',
    message: '', statut: 'En attente',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('contacts').insert([form])
    if (error) {
      toast.error('Erreur : ' + error.message)
    } else {
      setSubmitted(true)
      toast.success('Message envoyé !')
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow p-8 text-center">
        <span className="text-6xl block mb-4">🎉</span>
        <h3 className="text-2xl font-bold text-primary mb-2">Message envoyé !</h3>
        <p className="text-gray-500 mb-6">Merci ! Nous vous contacterons très bientôt.</p>
        <button onClick={() => setSubmitted(false)}
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition">
          Envoyer un autre message
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow p-8">
      <h3 className="text-2xl font-bold text-primary mb-4 text-center">📩 Réserver nos services</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input type="text" value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              required placeholder="Jean Dupont"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required placeholder="jean@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input type="text" value={form.telephone}
              onChange={(e) => setForm({ ...form, telephone: e.target.value })}
              placeholder="+221 XX XXX XX XX"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type d'événement</label>
            <select value={form.type_evenement}
              onChange={(e) => setForm({ ...form, type_evenement: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Sélectionner</option>
              <option value="Messe">⛪ Messe</option>
              <option value="Mariage">💒 Mariage</option>
              <option value="Funérailles">🕊️ Funérailles</option>
              <option value="Concert">🎤 Concert</option>
              <option value="Célébration">🎉 Célébration</option>
              <option value="Graduation">🎓 Graduation</option>
              <option value="Retraite">🙏 Retraite</option>
              <option value="Autre">✨ Autre</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date de l'événement</label>
          <input type="date" value={form.date_evenement}
            onChange={(e) => setForm({ ...form, date_evenement: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Décrivez votre événement..." rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-800 transition disabled:opacity-50">
          {loading ? '⏳ Envoi en cours...' : '📩 Envoyer ma demande'}
        </button>
      </form>
    </div>
  )
}

export default ContactForm