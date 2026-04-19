import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase/client'
import Layout from '../components/Layout'
import toast, { Toaster } from 'react-hot-toast'
import { checkIsAdmin } from '../supabase/admin'
import { useNavigate } from 'react-router-dom'

const Finances = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const navigate = useNavigate()
  const [form, setForm] = useState({
    titre: '',
    type: 'Entrée',
    montant: '',
    description: '',
    date: '',
  })

  useEffect(() => {
    const verifyAdmin = async () => {
      const admin = await checkIsAdmin()
      if (!admin) {
        toast.error('Accès refusé !')
        navigate('/dashboard')
      } else {
        setIsAdmin(true)
        fetchTransactions()
      }
    }
    verifyAdmin()
  }, [navigate])

  const fetchTransactions = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('finances')
      .select('*')
      .order('date', { ascending: false })
    if (error) {
      toast.error('Erreur lors du chargement')
    } else {
      setTransactions(data)
    }
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase
      .from('finances')
      .insert([form])
    if (error) {
      toast.error('Erreur lors de l\'ajout')
    } else {
      toast.success('Transaction ajoutée !')
      setShowForm(false)
      setForm({
        titre: '',
        type: 'Entrée',
        montant: '',
        description: '',
        date: '',
      })
      fetchTransactions()
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cette transaction ?")) {
      const { error } = await supabase
        .from('finances')
        .delete()
        .eq('id', id)
      if (error) {
        toast.error('Erreur lors de la suppression')
      } else {
        toast.success('Transaction supprimée !')
        fetchTransactions()
      }
    }
  }

  const totalEntrees = transactions
    .filter(t => t.type === 'Entrée')
    .reduce((acc, t) => acc + parseFloat(t.montant || 0), 0)

  const totalSorties = transactions
    .filter(t => t.type === 'Sortie')
    .reduce((acc, t) => acc + parseFloat(t.montant || 0), 0)

  const solde = totalEntrees - totalSorties

  return (
    <Layout>
      <Toaster />
      <div className="p-4 md:p-6 max-w-full overflow-hidden">

        {/* Header - Adapté Mobile */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-primary">💰 Finances</h2>
            <p className="text-sm text-gray-500">Gestion financière de la chorale</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="w-full md:w-auto bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition duration-300"
            >
              {showForm ? '✕ Fermer' : '+ Nouvelle transaction'}
            </button>
          )}
        </div>

        {/* Statistiques - Grid responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-green-500">
            <p className="text-gray-500 text-xs uppercase font-bold">Total Entrées</p>
            <p className="text-xl md:text-2xl font-black text-green-600">
              {totalEntrees.toLocaleString()} <span className="text-sm">FCFA</span>
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-red-500">
            <p className="text-gray-500 text-xs uppercase font-bold">Total Sorties</p>
            <p className="text-xl md:text-2xl font-black text-red-600">
              {totalSorties.toLocaleString()} <span className="text-sm">FCFA</span>
            </p>
          </div>
          <div className={`bg-white rounded-2xl shadow-sm p-5 border-l-4 sm:col-span-2 lg:col-span-1 ${solde >= 0 ? 'border-primary' : 'border-orange-500'}`}>
            <p className="text-gray-500 text-xs uppercase font-bold">Solde Actuel</p>
            <p className={`text-xl md:text-2xl font-black ${solde >= 0 ? 'text-primary' : 'text-red-600'}`}>
              {solde.toLocaleString()} <span className="text-sm">FCFA</span>
            </p>
          </div>
        </div>

        {/* Formulaire - Responsive */}
        {showForm && isAdmin && (
          <div className="bg-white rounded-2xl shadow p-5 mb-6">
            <h3 className="text-lg font-bold text-primary mb-4 border-b pb-2">Nouvelle transaction</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">Titre de l'opération</label>
                <input
                  type="text"
                  placeholder="Ex: Cotisations mensuelles"
                  value={form.titre}
                  onChange={(e) => setForm({ ...form, titre: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none"
                >
                  <option value="Entrée">📈 Entrée (Revenu)</option>
                  <option value="Sortie">📉 Sortie (Dépense)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Montant (FCFA)</label>
                <input
                  type="number"
                  value={form.montant}
                  onChange={(e) => setForm({ ...form, montant: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">Description (Optionnel)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition"
                >
                  Enregistrer la transaction
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Historique - Tableau avec Scroll horizontal propre */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="p-5 border-b">
            <h3 className="font-bold text-primary">Historique récent</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-[10px] font-black text-gray-500 uppercase">Date / Titre</th>
                  <th className="px-5 py-3 text-left text-[10px] font-black text-gray-500 uppercase">Type</th>
                  <th className="px-5 py-3 text-right text-[10px] font-black text-gray-500 uppercase">Montant</th>
                  <th className="px-5 py-3 text-right text-[10px] font-black text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="4" className="p-10 text-center text-gray-400">Chargement...</td></tr>
                ) : transactions.length === 0 ? (
                  <tr><td colSpan="4" className="p-10 text-center text-gray-400">Aucune donnée trouvée.</td></tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-4">
                        <div className="text-[10px] text-gray-400">
                          {t.date ? new Date(t.date).toLocaleDateString('fr-FR') : '-'}
                        </div>
                        <div className="font-bold text-sm text-gray-800">{t.titre}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">{t.description}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          t.type === 'Entrée' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {t.type.toUpperCase()}
                        </span>
                      </td>
                      <td className={`px-5 py-4 text-right font-black text-sm ${
                        t.type === 'Entrée' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {t.type === 'Entrée' ? '+' : '-'} {parseFloat(t.montant).toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="p-2 text-gray-300 hover:text-red-600 transition"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  )
}

export default Finances