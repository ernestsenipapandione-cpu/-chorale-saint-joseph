import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase/client'
import Layout from '../components/Layout'
import toast, { Toaster } from 'react-hot-toast'

const Members = () => {
  const [membres, setMembres] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    voix: '',
    role: '',
    statut: 'Actif',
    date_adhesion: '',
  })

  useEffect(() => {
    fetchMembres()
  }, [])

  const fetchMembres = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('membres')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      toast.error('Erreur lors du chargement des membres')
    } else {
      setMembres(data)
    }
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase
      .from('membres')
      .insert([form])
    if (error) {
      toast.error('Erreur lors de l\'ajout du membre')
    } else {
      toast.success('Membre ajouté avec succès !')
      setShowForm(false)
      setForm({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        voix: '',
        role: '',
        statut: 'Actif',
        date_adhesion: '',
      })
      fetchMembres()
    }
  }

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('membres')
      .delete()
      .eq('id', id)
    if (error) {
      toast.error('Erreur lors de la suppression')
    } else {
      toast.success('Membre supprimé !')
      fetchMembres()
    }
  }

  return (
    <Layout>
      <Toaster />
      <div className="p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-primary">👥 Membres</h2>
            <p className="text-gray-500">Gérez les membres de la chorale</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition duration-300"
          >
            {showForm ? '✕ Fermer' : '+ Ajouter un membre'}
          </button>
        </div>

        {/* Formulaire */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h3 className="text-xl font-bold text-primary mb-4">Nouveau membre</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input
                  type="text"
                  value={form.prenom}
                  onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="text"
                  value={form.telephone}
                  onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Voix</label>
                <select
                  value={form.voix}
                  onChange={(e) => setForm({ ...form, voix: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Sélectionner</option>
                  <option value="Soprano">Soprano</option>
                  <option value="Alto">Alto</option>
                  <option value="Ténor">Ténor</option>
                  <option value="Basse">Basse</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Sélectionner</option>
                  <option value="Administrateur">Administrateur</option>
                  <option value="Chef de choeur">Chef de choeur</option>
                  <option value="Membre">Membre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  value={form.statut}
                  onChange={(e) => setForm({ ...form, statut: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date d'adhésion</label>
                <input
                  type="date"
                  value={form.date_adhesion}
                  onChange={(e) => setForm({ ...form, date_adhesion: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition duration-300"
                >
                  Ajouter le membre
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des membres */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-xl font-bold text-primary mb-4">
            Liste des membres ({membres.length})
          </h3>
          {loading ? (
            <p className="text-gray-500">Chargement...</p>
          ) : membres.length === 0 ? (
            <p className="text-gray-500">Aucun membre pour le moment</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">Nom</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">Email</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">Voix</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">Rôle</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">Statut</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {membres.map((membre) => (
                    <tr key={membre.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">
                        {membre.prenom} {membre.nom}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{membre.email}</td>
                      <td className="px-4 py-3 text-gray-500">{membre.voix}</td>
                      <td className="px-4 py-3 text-gray-500">{membre.role}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          membre.statut === 'Actif' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {membre.statut}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(membre.id)}
                          className="text-red-500 hover:text-red-700 font-medium text-sm"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </Layout>
  )
}

export default Members