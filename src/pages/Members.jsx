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
    if (window.confirm("Voulez-vous vraiment supprimer ce membre ?")) {
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
  }

  return (
    <Layout>
      <Toaster />
      <div className="p-4 md:p-6 max-w-full overflow-hidden">

        {/* Header - Corrigé pour mobile */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-primary">👥 Membres</h2>
            <p className="text-sm text-gray-500">Gérez les membres de la chorale</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full md:w-auto bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition duration-300"
          >
            {showForm ? '✕ Fermer' : '+ Ajouter un membre'}
          </button>
        </div>

        {/* Formulaire - Grilles adaptées */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow p-4 md:p-6 mb-6">
            <h3 className="text-lg font-bold text-primary mb-4">Nouveau membre</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Prénom</label>
                <input
                  type="text"
                  value={form.prenom}
                  onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="text"
                  value={form.telephone}
                  onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Voix</label>
                <select
                  value={form.voix}
                  onChange={(e) => setForm({ ...form, voix: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Sélectionner</option>
                  <option value="Soprano">Soprano</option>
                  <option value="Alto">Alto</option>
                  <option value="Ténor">Ténor</option>
                  <option value="Basse">Basse</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Rôle</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Sélectionner</option>
                  <option value="Administrateur">Administrateur</option>
                  <option value="Chef de choeur">Chef de choeur</option>
                  <option value="Membre">Membre</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Statut</label>
                <select
                  value={form.statut}
                  onChange={(e) => setForm({ ...form, statut: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date d'adhésion</label>
                <input
                  type="date"
                  value={form.date_adhesion}
                  onChange={(e) => setForm({ ...form, date_adhesion: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="sm:col-span-2">
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

        {/* Liste des membres - Défilement horizontal forcé */}
        <div className="bg-white rounded-2xl shadow p-4 md:p-6 overflow-hidden">
          <h3 className="text-lg font-bold text-primary mb-4">
            Liste des membres ({membres.length})
          </h3>
          {loading ? (
            <p className="text-gray-500">Chargement...</p>
          ) : membres.length === 0 ? (
            <p className="text-gray-500">Aucun membre pour le moment</p>
          ) : (
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Nom</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Voix</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Rôle</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Statut</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {membres.map((membre) => (
                    <tr key={membre.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{membre.prenom} {membre.nom}</div>
                        <div className="text-xs text-gray-500">{membre.email}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{membre.voix}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{membre.role}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          membre.statut === 'Actif' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {membre.statut}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDelete(membre.id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d=" orbit-19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="md:hidden text-center text-[10px] text-gray-400 mt-2 italic">
                ← Glissez vers la gauche pour voir plus →
              </div>
            </div>
          )}
        </div>

      </div>
    </Layout>
  )
}

export default Members;