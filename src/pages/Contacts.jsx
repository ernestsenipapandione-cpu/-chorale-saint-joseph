import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase/client'
import Layout from '../components/Layout'
import toast, { Toaster } from 'react-hot-toast'
import emailjs from '@emailjs/browser'

const EMAILJS_SERVICE_ID = 'service_4shh46i'
const EMAILJS_TEMPLATE_ID = 'template_34enll1'
const EMAILJS_PUBLIC_KEY = 'bk6CAUHWJSxXwASyr'

const Contacts = () => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    checkAdmin()
    fetchContacts()
  }, [])

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.email === 'ernestsenipapa.ndione@unchk.edu.sn') {
      setIsAdmin(true)
    }
  }

  const fetchContacts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      toast.error('Erreur lors du chargement')
    } else {
      setContacts(data)
    }
    setLoading(false)
  }

  const sendEmail = async (contact, statut) => {
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          nom: contact.nom,
          email: contact.email,
          type_evenement: contact.type_evenement,
          date_evenement: contact.date_evenement || 'Non précisée',
          statut: statut,
        },
        EMAILJS_PUBLIC_KEY
      )
      toast.success('Email envoyé à ' + contact.email)
    } catch (error) {
      toast.error('Erreur envoi email : ' + error.message)
    }
  }

  const openWhatsApp = (contact, statut) => {
    const message = statut === 'Confirmé'
      ? `Bonjour ${contact.nom}, nous confirmons votre réservation pour ${contact.type_evenement} le ${contact.date_evenement || 'date à confirmer'}. Merci de nous avoir contactés ! - Chorale Saint Joseph 🎵`
      : `Bonjour ${contact.nom}, nous sommes désolés de vous informer que nous ne pouvons pas honorer votre demande pour ${contact.type_evenement}. - Chorale Saint Joseph 🎵`

    const whatsappUrl = `https://wa.me/${contact.telephone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const updateStatut = async (contact, statut) => {
    if (!isAdmin) {
      toast.error('Vous n\'êtes pas autorisé à effectuer cette action !')
      return
    }

    const { error } = await supabase
      .from('contacts')
      .update({ statut })
      .eq('id', contact.id)

    if (error) {
      toast.error('Erreur lors de la mise à jour')
    } else {
      toast.success('Statut mis à jour !')
      await sendEmail(contact, statut)
      openWhatsApp(contact, statut)
      fetchContacts()
    }
  }

  const handleDelete = async (id) => {
    if (!isAdmin) {
      toast.error('Vous n\'êtes pas autorisé à effectuer cette action !')
      return
    }
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id)
    if (error) {
      toast.error('Erreur lors de la suppression')
    } else {
      toast.success('Demande supprimée !')
      fetchContacts()
    }
  }

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'En attente': return 'bg-yellow-100 text-yellow-600'
      case 'Confirmé': return 'bg-green-100 text-green-600'
      case 'Refusé': return 'bg-red-100 text-red-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Messe': return '⛪'
      case 'Mariage': return '💒'
      case 'Funérailles': return '🕊️'
      case 'Concert': return '🎤'
      case 'Célébration': return '🎉'
      case 'Graduation': return '🎓'
      case 'Retraite': return '🙏'
      default: return '✨'
    }
  }

  return (
    <Layout>
      <Toaster />
      <div className="p-6">

        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-primary">📩 Demandes de réservation</h2>
            <p className="text-gray-500">Gérez les demandes des clients</p>
          </div>
          {isAdmin && (
            <span className="bg-secondary text-white px-4 py-2 rounded-xl font-semibold text-sm">
              👑 Mode Admin
            </span>
          )}
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
            <span className="text-4xl">📩</span>
            <div>
              <p className="text-gray-500 text-sm">Total demandes</p>
              <p className="text-2xl font-bold text-primary">{contacts.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
            <span className="text-4xl">⏳</span>
            <div>
              <p className="text-gray-500 text-sm">En attente</p>
              <p className="text-2xl font-bold text-yellow-500">
                {contacts.filter(c => c.statut === 'En attente').length}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
            <span className="text-4xl">✅</span>
            <div>
              <p className="text-gray-500 text-sm">Confirmées</p>
              <p className="text-2xl font-bold text-green-500">
                {contacts.filter(c => c.statut === 'Confirmé').length}
              </p>
            </div>
          </div>
        </div>

        {/* Liste des demandes */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-xl font-bold text-primary mb-4">
            Liste des demandes ({contacts.length})
          </h3>
          {loading ? (
            <p className="text-gray-500">Chargement...</p>
          ) : contacts.length === 0 ? (
            <p className="text-gray-500">Aucune demande pour le moment</p>
          ) : (
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="border rounded-2xl p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getTypeIcon(contact.type_evenement)}</span>
                      <div>
                        <h4 className="font-bold text-primary">{contact.nom}</h4>
                        <p className="text-sm text-gray-500">{contact.email}</p>
                        {contact.telephone && (
                          <p className="text-sm text-gray-500">📞 {contact.telephone}</p>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatutColor(contact.statut)}`}>
                      {contact.statut}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-gray-500">
                    <p>📅 {contact.type_evenement}</p>
                    {contact.date_evenement && (
                      <p>🗓️ {new Date(contact.date_evenement).toLocaleDateString('fr-FR')}</p>
                    )}
                  </div>

                  {contact.message && (
                    <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 mb-3">
                      💬 {contact.message}
                    </p>
                  )}

                  {isAdmin && (
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => updateStatut(contact, 'Confirmé')}
                        className="bg-green-100 text-green-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-200 transition"
                      >
                        ✅ Confirmer
                      </button>
                      <button
                        onClick={() => updateStatut(contact, 'Refusé')}
                        className="bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-200 transition"
                      >
                        ❌ Refuser
                      </button>
                      <button
                        onClick={() => updateStatut(contact, 'En attente')}
                        className="bg-yellow-100 text-yellow-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-yellow-200 transition"
                      >
                        ⏳ En attente
                      </button>
                      <button
                        onClick={() => handleDelete(contact.id)}
                        className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-200 transition"
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </Layout>
  )
}

export default Contacts