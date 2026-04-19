import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase/client'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    membres: 0,
    evenements: 0,
    partitions: 0,
    messages: 0,
    finances: 0,
    reservations: 0,
  })
  const [reservations, setReservations] = useState([])
  const [evenements, setEvenements] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate('/login')
      } else {
        setUser(user)
        fetchStats()
      }
    }
    getUser()
  }, [navigate])

  const fetchStats = async () => {
    setLoading(true)
    const [membres, evenements, partitions, messages, finances, resData] = await Promise.all([
      supabase.from('membres').select('*', { count: 'exact', head: true }),
      supabase.from('evenements').select('*', { count: 'exact', head: true }),
      supabase.from('partitions').select('*', { count: 'exact', head: true }),
      supabase.from('messages').select('*', { count: 'exact', head: true }),
      supabase.from('finances').select('montant, type'),
      supabase.from('contacts').select('*').order('created_at', { ascending: false }).limit(5),
    ])

    const totalEntrees = finances.data
      ? finances.data
          .filter(f => f.type === 'Entrée')
          .reduce((acc, f) => acc + parseFloat(f.montant || 0), 0)
      : 0
    
    const totalSorties = finances.data
      ? finances.data
          .filter(f => f.type === 'Sortie')
          .reduce((acc, f) => acc + parseFloat(f.montant || 0), 0)
      : 0

    setStats({
      membres: membres.count || 0,
      evenements: evenements.count || 0,
      partitions: partitions.count || 0,
      messages: messages.count || 0,
      finances: totalEntrees - totalSorties,
      reservations: resData.data?.length || 0,
    })

    setReservations(resData.data || [])

    const { data: evData } = await supabase
      .from('evenements')
      .select('*')
      .gte('date_debut', new Date().toISOString())
      .order('date_debut', { ascending: true })
      .limit(5)
    setEvenements(evData || [])
    setLoading(false)
  }

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'En attente': return 'bg-yellow-100 text-yellow-600'
      case 'Confirmé': return 'bg-green-100 text-green-600'
      case 'Refusé': return 'bg-red-100 text-red-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <Layout>
      <div className="p-4 md:p-6 lg:p-8">
        
        {/* Header Bienvenue - Adapté Mobile */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-primary flex items-center gap-2">
                Bienvenue 👋
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Gestionnaire Chorale Saint Joseph
              </p>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
              <p className="text-[10px] uppercase font-black text-blue-400 leading-none mb-1">Session active</p>
              <p className="text-xs font-bold text-primary truncate max-w-[200px]">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Cartes statistiques - Grid intelligent 2 colonnes mobile / 6 desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-8">
          {[
            { label: 'Membres', val: stats.membres, icon: '👥', color: 'text-blue-600' },
            { label: 'Events', val: stats.evenements, icon: '📅', color: 'text-purple-600' },
            { label: 'Chants', val: stats.partitions, icon: '🎵', color: 'text-pink-600' },
            { label: 'Messages', val: stats.messages, icon: '💬', color: 'text-orange-600' },
            { label: 'Caisse', val: `${stats.finances.toLocaleString()} F`, icon: '💰', color: 'text-green-600', special: true },
            { label: 'Réserv.', val: stats.reservations, icon: '📩', color: 'text-indigo-600' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-50 p-4 flex flex-col items-center text-center hover:shadow-md transition">
              <span className="text-2xl mb-1">{s.icon}</span>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{s.label}</p>
              <p className={`text-sm md:text-lg font-black truncate w-full ${s.color}`}>
                {loading ? '...' : s.val}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Prochains événements */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-black text-primary uppercase text-xs tracking-widest flex items-center gap-2">
                <span>📅</span> Agenda à venir
              </h3>
            </div>
            <div className="p-5">
              {evenements.length === 0 ? (
                <p className="text-center py-4 text-gray-400 text-sm">Aucun événement prévu</p>
              ) : (
                <div className="space-y-4">
                  {evenements.map((ev) => (
                    <div key={ev.id} className="flex items-start gap-4 group">
                      <div className="bg-primary/5 text-primary p-3 rounded-2xl font-black text-center min-w-[60px]">
                        <p className="text-[10px] uppercase leading-none mb-1">
                          {new Date(ev.date_debut).toLocaleDateString('fr-FR', { month: 'short' })}
                        </p>
                        <p className="text-xl leading-none">
                          {new Date(ev.date_debut).toLocaleDateString('fr-FR', { day: '2-digit' })}
                        </p>
                      </div>
                      <div className="flex-1 border-b border-gray-50 pb-3">
                        <p className="font-bold text-gray-800 group-hover:text-primary transition">{ev.titre}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          📍 {ev.lieu || 'Lieu non défini'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dernières réservations */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-black text-primary uppercase text-xs tracking-widest flex items-center gap-2">
                <span>📩</span> Demandes de prestations
              </h3>
            </div>
            <div className="p-5">
              {reservations.length === 0 ? (
                <p className="text-center py-4 text-gray-400 text-sm">Aucune demande reçue</p>
              ) : (
                <div className="space-y-4">
                  {reservations.map((res) => (
                    <div key={res.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                      <div className="max-w-[60%]">
                        <p className="font-bold text-sm text-gray-800 truncate">{res.nom}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{res.type_evenement}</p>
                      </div>
                      <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter ${getStatutColor(res.statut)}`}>
                        {res.statut}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}

export default Dashboard