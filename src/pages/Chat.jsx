import React, { useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '../supabase/client'
import Layout from '../components/Layout'
import toast, { Toaster } from 'react-hot-toast'

const Chat = () => {
  const [messages, setMessages] = useState([])
  const [contenu, setContenu] = useState('')
  const [user, setUser] = useState(null)
  const [section, setSection] = useState('Général')
  const messagesEndRef = useRef(null)

  const sections = ['Général', 'Soprano', 'Alto', 'Ténor', 'Basse']

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const fetchMessages = useCallback(async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('section', section)
      .order('created_at', { ascending: true })
    if (error) {
      toast.error('Erreur lors du chargement des messages')
    } else {
      setMessages(data)
    }
  }, [section])

  useEffect(() => {
    fetchMessages()

    const channel = supabase
      .channel(`messages-${section}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          if (payload.new.section === section) {
            setMessages((prev) => [...prev, payload.new])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [section, fetchMessages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!contenu.trim()) return

    const { error } = await supabase
      .from('messages')
      .insert([{
        contenu: contenu,
        auteur: user?.email,
        section: section,
      }])
    if (error) {
      toast.error('Erreur : ' + error.message)
    } else {
      setContenu('')
    }
  }

  return (
    <Layout>
      <Toaster />
      {/* CORRECTION ICI : Utilisation de h-[calc(100dvh-theme(spacing.16))] pour s'adapter au clavier mobile */}
      <div className="flex flex-col h-[calc(100dvh-80px)] p-4 md:p-6">

        {/* Header - Réduit un peu les marges pour gagner de la place sur mobile */}
        <div className="mb-2 md:mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-primary">💬 Chat</h2>
          <p className="text-sm text-gray-500">Communiquez avec les membres</p>
        </div>

        {/* Sections - Ajout de overflow-x-auto pour que ça ne casse pas sur petit écran */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
          {sections.map((s) => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`px-4 py-2 rounded-xl font-semibold text-xs md:text-sm whitespace-nowrap transition duration-200 ${
                section === s
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 shadow-sm hover:bg-gray-100'
              }`}
            >
              {s === 'Général' ? '💬' : '🎵'} {s}
            </button>
          ))}
        </div>

        {/* Zone des Messages - flex-1 permet de prendre tout l'espace restant */}
        <div className="flex-1 bg-white rounded-2xl shadow-inner border border-gray-100 p-4 overflow-y-auto mb-4">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-center mt-10 text-sm">
              Aucun message dans {section}
            </p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${
                  message.auteur === user?.email ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className={`max-w-[85%] md:max-w-md px-4 py-3 rounded-2xl ${
                  message.auteur === user?.email
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}>
                  {message.auteur !== user?.email && (
                    <p className="text-[10px] font-bold mb-1 text-primary uppercase tracking-wider">
                      {message.auteur.split('@')[0]}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed">{message.contenu}</p>
                  <p className={`text-[10px] mt-1 text-right ${
                    message.auteur === user?.email
                      ? 'text-blue-200'
                      : 'text-gray-400'
                  }`}>
                    {new Date(message.created_at).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form - Reste fixé en bas de la zone 100dvh */}
        <form onSubmit={handleSend} className="flex gap-2 bg-white p-1 rounded-2xl shadow-lg border border-gray-200">
          <input
            type="text"
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            placeholder="Écrire un message..."
            className="flex-1 px-4 py-3 text-sm focus:outline-none bg-transparent"
          />
          <button
            type="submit"
            disabled={!contenu.trim()}
            className="bg-primary text-white p-3 rounded-xl font-semibold hover:bg-blue-800 transition duration-300 disabled:opacity-50"
          >
            <span className="md:hidden">📤</span>
            <span className="hidden md:inline">Envoyer</span>
          </button>
        </form>

      </div>
    </Layout>
  )
}

export default Chat;
