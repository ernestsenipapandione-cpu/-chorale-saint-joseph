import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase/client'
import Layout from '../components/Layout'
import toast, { Toaster } from 'react-hot-toast'
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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate('/login')
        return
      }

      const { data: memberData } = await supabase
        .from('membres')
        .select('role')
        .eq('email', user.email.toLowerCase())
        .single()

      if (memberData?.role?.toLowerCase() === 'admin') {
        setIsAdmin(true)
        fetchTransactions()
      } else {
        toast.error('Accès refusé !')
        navigate('/dashboard')
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
    if (error) toast.error('Erreur de chargement')
    else setTransactions(data || [])
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('finances').insert([form])
    if (error) toast.error('Erreur lors de l\'ajout')
    else {
      toast.success('Transaction ajoutée !')
      setShowForm(false)
      setForm({ titre: '', type: 'Entrée', montant: '', description: '', date: '' })
      fetchTransactions()
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cette transaction ?")) {
      const { error } = await supabase.from('finances').delete().eq('id', id)
      if (error) toast.error('Erreur de suppression')
      else {
        toast.success('Supprimé !')
        fetchTransactions()
      }
    }
  }

  const totalEntrees = transactions.filter(t => t.type === 'Entrée').reduce((acc, t) => acc + parseFloat(t.montant || 0), 0)
  const totalSorties = transactions.filter(t => t.type === 'Sortie').reduce((acc, t) => acc + parseFloat(t.montant || 0), 0)
  const solde = totalEntrees - totalSorties

  return (
    <Layout>
      <Toaster />
      <div className="p-4 md:p-6 max-w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-blue-900">💰 Finances</h2>
          </div>
          {isAdmin && (
            <button onClick={() => setShowForm(!showForm)} className="bg-blue-900 text-white px-6 py-2 rounded-xl font-bold">
              {showForm ? '✕ Fermer' : '+ Nouvelle transaction'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-green-500">
            <p className="text-xs font-bold text-gray-500 uppercase">Entrées</p>
            <p className="text-xl font-black text-green-600">{totalEntrees.toLocaleString()} FCFA</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-red-500">
            <p className="text-xs font-bold text-gray-500 uppercase">Sorties</p>
            <p className="text-xl font-black text-red-600">{totalSorties.toLocaleString()} FCFA</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-blue-900">
            <p className="text-xs font-bold text-gray-500 uppercase">Solde</p>
            <p className="text-xl font-black text-blue-900">{solde.toLocaleString()} FCFA</p>
          </div>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-2xl shadow-md mb-6 animate-in fade-in duration-300">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Titre" className="p-2 border rounded-xl" value={form.titre} onChange={e => setForm({...form, titre: e.target.value})} required />
              <select className="p-2 border rounded-xl" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                <option value="Entrée">📈 Entrée</option>
                <option value="Sortie">📉 Sortie</option>
              </select>
              <input type="number" placeholder="Montant" className="p-2 border rounded-xl" value={form.montant} onChange={e => setForm({...form, montant: e.target.value})} required />
              <input type="date" className="p-2 border rounded-xl" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
              <button type="submit" className="md:col-span-2 bg-blue-900 text-white py-3 rounded-xl font-bold">Enregistrer</button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400">
                <tr>
                  <th className="p-4">Détails</th>
                  <th className="p-4">Type</th>
                  <th className="p-4 text-right">Montant</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {transactions.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-bold text-sm">{t.titre}</div>
                      <div className="text-xs text-gray-400">{new Date(t.date).toLocaleDateString()}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${t.type === 'Entrée' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className={`p-4 text-right font-bold ${t.type === 'Entrée' ? 'text-green-600' : 'text-red-600'}`}>
                      {parseFloat(t.montant).toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(t.id)} className="text-gray-300 hover:text-red-600">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Finances;