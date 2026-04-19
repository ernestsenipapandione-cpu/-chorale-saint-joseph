import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase/client'
import Layout from '../components/Layout'
import toast, { Toaster } from 'react-hot-toast'

const Calendar = () => {
  const [evenements, setEvenements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    titre: '',
    description: '',
    type: '',
    date_debut: '',
    date_fin: '',
    lieu: '',
  })

  useEffect(() => {
    fetchEvenements()
  }, [])

  const fetchEvenements = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('evenements')
      .select('*')
      .order('date_debut', { ascending: true })
    if (error) {
      toast.error('Erreur lors du chargement des événements')
    } else {
      setEvenements(data)
    }
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase
      .from('evenements')
      .insert([form])
    if (error) {
      toast.error('Erreur lors de l\'ajout de l\'événement')
    } else {
      toast.success('Événement ajouté avec succès !')
      setShowForm(false)
      setForm({
        titre: '',
        description: '',
        type: '',
        date_debut: '',
        date_fin: '',
        lieu: '',
      })
      fetchEvenements()
    }
  }

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('evenements')
      .delete()
      .eq('id', id)
    if (error) {
      toast.error('Erreur lors de la suppression')
    } else {
      toast.success('Événement supprimé !')
      fetchEvenements()
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Concert': return 'bg-purple-100 text-purple-600'
      case 'Répétition': return 'bg-blue-100 text-blue-600'
      case 'Messe': return 'bg-yellow-100 text-yellow-600'
      case 'Spécial': return 'bg-green-100 text-green-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Concert': return '🎤'
      case 'Répétition': return '🎵'
      case 'Messe': return '⛪'
      case 'Spécial': return '🎉'
      default: return '📅'
    }
  }

  return (
    <Layout>
      <Toaster />
      <div className="p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-primary">📅 Calendrier</h2>
            <p className="text-gray-500">Gérez les événements de la chorale</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition duration-300"
          >
            {showForm ? '✕ Fermer' : '+ Ajouter un événement'}
          </button>
        </div>

        {/* Formulaire */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h3 className="text-xl font-bold text-primary mb-4">Nouvel événement</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  value={form.titre}
                  onChange={(e) => setForm({ ...form, titre: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Sélectionner</option>
                  <option value="Concert">🎤 Concert</option>
                  <option value="Répétition">🎵 Répétition</option>
                  <option value="Messe">⛪ Messe</option>
                  <option value="Spécial">🎉 Spécial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date début</label>
                <input
                  type="datetime-local"
                  value={form.date_debut}
                  onChange={(e) => setForm({ ...form, date_debut: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
                <input
                  type="datetime-local"
                  value={form.date_fin}
                  onChange={(e) => setForm({ ...form, date_fin: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
                <input
                  type="text"
                  value={form.lieu}
                  onChange={(e) => setForm({ ...form, lieu: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="3"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition duration-300"
                >
                  Ajouter l'événement
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des événements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-gray-500">Chargement...</p>
          ) : evenements.length === 0 ? (
            <p className="text-gray-500">Aucun événement pour le moment</p>
          ) : (
            evenements.map((evenement) => (
              <div key={evenement.id} className="bg-white rounded-2xl shadow p-6">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-3xl">{getTypeIcon(evenement.type)}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(evenement.type)}`}>
                    {evenement.type}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">{evenement.titre}</h3>
                {evenement.description && (
                  <p className="text-gray-500 text-sm mb-3">{evenement.description}</p>
                )}
                <div className="space-y-1 text-sm text-gray-500">
                  <p>📅 {new Date(evenement.date_debut).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                  {evenement.lieu && <p>📍 {evenement.lieu}</p>}
                </div>
                <button
                  onClick={() => handleDelete(evenement.id)}
                  className="mt-4 text-red-500 hover:text-red-700 font-medium text-sm"
                >
                  Supprimer
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </Layout>
  )
}

export default Calendar;