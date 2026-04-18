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
    const [membres, evenements, partitions, messages, finances, reservations] = await Promise.all([
      supabase.from('membres').select('*', { count: 'exact' }),
      supabase.from('evenements').select('*', { count: 'exact' }),
      supabase.from('partitions').select('*', { count: 'exact' }),
      supabase.from('messages').select('*', { count: 'exact' }),
      supabase.from('finances').select('montant, type'),
      supabase.from('contacts').select('*').order('created_at', { ascending: false }).limit(5),
    ])

    const totalFinances = finances.data
      ? finances.data
          .filter(f => f.type === 'Entrée')
          .reduce((acc, f) => acc + parseFloat(f.montant || 0), 0)
      : 0

    setStats({
      membres: membres.count || 0,
      evenements: evenements.count || 0,
      partitions: partitions.count || 0,
      messages: messages.count || 0,
      finances: totalFinances,
      reservations: reservations.data?.length || 0,
    })

    setReservations(reservations.data || [])

    const { data: evData } = await supabase
      .from('evenements')
      .select('*')
      .gte('date_debut', new Date().toISOString())
      .order('date_debut', { ascending: true })
      .limit(5)
    setEvenements(evData || [])
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
      <div className="p-6">

        {/* Bienvenue */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-primary">
            Bienvenue 👋
          </h2>
          <p className="text-gray-500 mt-1">
            Tableau de bord de la Chorale Saint Joseph
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {user?.email}
          </p>
        </div>

        {/* Cartes statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center">
            <span className="text-3xl mb-2">👥</span>
            <p className="text-gray-500 text-xs">Membres</p>
            <p className="text-2xl font-bold text-primary">{stats.membres}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center">
            <span className="text-3xl mb-2">📅</span>
            <p className="text-gray-500 text-xs">Événements</p>
            <p className="text-2xl font-bold text-primary">{stats.evenements}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center">
            <span className="text-3xl mb-2">🎵</span>
            <p className="text-gray-500 text-xs">Partitions</p>
            <p className="text-2xl font-bold text-primary">{stats.partitions}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center">
            <span className="text-3xl mb-2">💬</span>
            <p className="text-gray-500 text-xs">Messages</p>
            <p className="text-2xl font-bold text-primary">{stats.messages}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center">
            <span className="text-3xl mb-2">💰</span>
            <p className="text-gray-500 text-xs">Finances</p>
            <p className="text-lg font-bold text-green-500">
              {stats.finances.toLocaleString()} F
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center">
            <span className="text-3xl mb-2">📩</span>
            <p className="text-gray-500 text-xs">Réservations</p>
            <p className="text-2xl font-bold text-primary">{stats.reservations}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Prochains événements */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold text-primary mb-4">
              📅 Prochains événements
            </h3>
            {evenements.length === 0 ? (
              <p className="text-gray-500">Aucun événement à venir</p>
            ) : (
              <div className="space-y-3">
                {evenements.map((ev) => (
                  <div key={ev.id} className="flex items-center gap-3 border-b pb-3">
                    <span className="text-2xl">📅</span>
                    <div>
                      <p className="font-semibold text-primary">{ev.titre}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(ev.date_debut).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                        })}
                      </p>
                      {ev.lieu && <p className="text-xs text-gray-400">📍 {ev.lieu}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dernières réservations */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold text-primary mb-4">
              📩 Dernières réservations
            </h3>
            {reservations.length === 0 ? (
              <p className="text-gray-500">Aucune réservation</p>
            ) : (
              <div className="space-y-3">
                {reservations.map((res) => (
                  <div key={res.id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="font-semibold text-primary">{res.nom}</p>
                      <p className="text-sm text-gray-500">{res.type_evenement}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatutColor(res.statut)}`}>
                      {res.statut}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </Layout>
  )
}

export default Dashboard