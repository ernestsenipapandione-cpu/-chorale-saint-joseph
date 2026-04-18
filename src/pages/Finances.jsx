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
      .order('created_at', { ascending: false })
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
      <div className="p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-primary">💰 Finances</h2>
            <p className="text-gray-500">Gestion financière de la chorale</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition duration-300"
            >
              {showForm ? '✕ Fermer' : '+ Ajouter une transaction'}
            </button>
          )}
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
            <span className="text-4xl">📈</span>
            <div>
              <p className="text-gray-500 text-sm">Total Entrées</p>
              <p className="text-2xl font-bold text-green-500">
                {totalEntrees.toLocaleString()} FCFA
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
            <span className="text-4xl">📉</span>
            <div>
              <p className="text-gray-500 text-sm">Total Sorties</p>
              <p className="text-2xl font-bold text-red-500">
                {totalSorties.toLocaleString()} FCFA
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
            <span className="text-4xl">💰</span>
            <div>
              <p className="text-gray-500 text-sm">Solde</p>
              <p className={`text-2xl font-bold ${solde >= 0 ? 'text-primary' : 'text-red-500'}`}>
                {solde.toLocaleString()} FCFA
              </p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        {showForm && isAdmin && (
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h3 className="text-xl font-bold text-primary mb-4">Nouvelle transaction</h3>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Entrée">📈 Entrée</option>
                  <option value="Sortie">📉 Sortie</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Montant (FCFA)</label>
                <input
                  type="number"
                  value={form.montant}
                  onChange={(e) => setForm({ ...form, montant: e.target.value })}
                  required
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition duration-300"
                >
                  Ajouter la transaction
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des transactions */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-xl font-bold text-primary mb-4">
            Historique des transactions ({transactions.length})
          </h3>
          {loading ? (
            <p className="text-gray-500">Chargement...</p>
          ) : transactions.length === 0 ? (
            <p className="text-gray-500">Aucune transaction pour le moment</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">Titre</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">Type</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">Montant</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">Date</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">Description</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{transaction.titre}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          transaction.type === 'Entrée'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.type === 'Entrée' ? '📈' : '📉'} {transaction.type}
                        </span>
                      </td>
                      <td className={`px-4 py-3 font-bold ${
                        transaction.type === 'Entrée' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {transaction.type === 'Entrée' ? '+' : '-'}
                        {parseFloat(transaction.montant).toLocaleString()} FCFA
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {transaction.date ? new Date(transaction.date).toLocaleDateString('fr-FR') : '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm">
                        {transaction.description || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="text-red-500 hover:text-red-700 font-medium text-sm"
                        >
                          🗑️ Supprimer
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

export default Finances