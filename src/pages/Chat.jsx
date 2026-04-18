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
      <div className="p-6 flex flex-col" style={{ height: 'calc(100vh - 0px)' }}>

        {/* Header */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-primary">💬 Chat</h2>
          <p className="text-gray-500">Communiquez avec les membres</p>
        </div>

        {/* Sections */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {sections.map((s) => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition duration-200 ${
                section === s
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {s === 'Général' ? '💬' : '🎵'} {s}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 bg-white rounded-2xl shadow p-4 overflow-y-auto mb-4">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">
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
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.auteur === user?.email
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {message.auteur !== user?.email && (
                    <p className="text-xs font-semibold mb-1 text-primary">
                      {message.auteur}
                    </p>
                  )}
                  <p className="text-sm">{message.contenu}</p>
                  <p className={`text-xs mt-1 ${
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

        {/* Input */}
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            placeholder={`Message dans ${section}...`}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition duration-300"
          >
            Envoyer 📤
          </button>
        </form>

      </div>
    </Layout>
  )
}

export default Chat