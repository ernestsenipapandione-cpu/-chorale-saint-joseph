import React, { useState } from 'react'
import Layout from '../components/Layout'

const Live = () => {
  const [started, setStarted] = useState(false)
  const [roomName, setRoomName] = useState('chorale-saint-joseph')

  const startMeeting = () => {
    // On nettoie le nom de la salle (pas d'espaces ni d'accents pour éviter les bugs)
    const cleanRoomName = roomName.trim().replace(/\s+/g, '-').toLowerCase()
    setRoomName(cleanRoomName)
    setStarted(true)
  }

  return (
    <Layout>
      <div className="p-4 md:p-6 h-full">

        {/* Header - Caché quand le live commence pour gagner de la place */}
        {!started && (
          <div className="mb-6">
            <h2 className="text-2xl font-black text-primary">🎬 Répétition Live</h2>
            <p className="text-gray-500">Rejoignez le direct en un clic</p>
          </div>
        )}

        {!started ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 text-center max-w-lg mx-auto">
            <span className="text-6xl mb-4 block">🎤</span>
            <h3 className="text-xl font-black text-primary mb-2">
              Prêt pour la répétition ?
            </h3>
            <p className="text-gray-500 text-sm mb-8">
              Vous allez rejoindre la salle sécurisée de la chorale. Pas besoin d'installer d'application.
            </p>

            <div className="mb-6 text-left">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">
                Nom de la salle
              </label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary font-bold text-primary"
                placeholder="Nom de la salle..."
              />
            </div>

            <button
              onClick={startMeeting}
              className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-blue-200 hover:scale-[1.02] transition transform"
            >
              🎬 Entrer dans la salle
            </button>

            {/* Avantages */}
            <div className="grid grid-cols-3 gap-3 mt-10">
              <div className="bg-blue-50 rounded-2xl p-3">
                <span className="text-xl block mb-1">📱</span>
                <p className="text-[10px] font-bold text-blue-600 uppercase">Mobile</p>
              </div>
              <div className="bg-purple-50 rounded-2xl p-3">
                <span className="text-xl block mb-1">⚡</span>
                <p className="text-[10px] font-bold text-purple-600 uppercase">Rapide</p>
              </div>
              <div className="bg-green-50 rounded-2xl p-3">
                <span className="text-xl block mb-1">🔒</span>
                <p className="text-[10px] font-bold text-green-600 uppercase">Privé</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-black rounded-3xl shadow-2xl overflow-hidden h-[75vh] md:h-[80vh] flex flex-col">
            <div className="bg-gray-900 text-white px-5 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-black uppercase tracking-widest">En direct : {roomName}</span>
              </div>
              <button
                onClick={() => setStarted(false)}
                className="bg-white/10 hover:bg-red-500 text-white px-4 py-1.5 rounded-xl text-xs font-bold transition"
              >
                ✕ Quitter
              </button>
            </div>
            
            {/* L'iframe Jitsi avec les permissions full-access */}
            <iframe
              src={`https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false`}
              className="flex-1 w-full border-none"
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              title="Répétition Live"
            />
          </div>
        )}

      </div>
    </Layout>
  )
}

export default Live