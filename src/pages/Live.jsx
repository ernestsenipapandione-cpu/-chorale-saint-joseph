import React, { useState } from 'react'
import Layout from '../components/Layout'

const Live = () => {
  const [started, setStarted] = useState(false)
  const [roomName, setRoomName] = useState('chorale-saint-joseph')

  const startMeeting = () => {
    setStarted(true)
  }

  return (
    <Layout>
      <div className="p-6">

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-primary">🎬 Répétition Live</h2>
          <p className="text-gray-500">Répétitions en direct de la chorale</p>
        </div>

        {!started ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center max-w-lg mx-auto">
            <span className="text-6xl mb-4 block">🎵</span>
            <h3 className="text-2xl font-bold text-primary mb-2">
              Rejoindre une répétition
            </h3>
            <p className="text-gray-500 mb-6">
              Cliquez sur le bouton pour rejoindre la salle de répétition en direct
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                Nom de la salle
              </label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              onClick={startMeeting}
              className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-800 transition duration-300"
            >
              🎬 Démarrer la répétition
            </button>

            {/* Infos */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-gray-50 rounded-xl p-4">
                <span className="text-2xl block mb-1">🎤</span>
                <p className="text-xs text-gray-500">Audio HD</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <span className="text-2xl block mb-1">📹</span>
                <p className="text-xs text-gray-500">Vidéo HD</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <span className="text-2xl block mb-1">🔒</span>
                <p className="text-xs text-gray-500">Sécurisé</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="bg-primary text-white px-6 py-3 flex justify-between items-center">
              <span className="font-semibold">🎵 Répétition en cours — {roomName}</span>
              <button
                onClick={() => setStarted(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-600 transition"
              >
                ✕ Quitter
              </button>
            </div>
            <iframe
              src={`https://meet.jit.si/${roomName}`}
              style={{ width: '100%', height: '600px', border: 'none' }}
              allow="camera; microphone; fullscreen; display-capture"
              title="Répétition Live"
            />
          </div>
        )}

      </div>
    </Layout>
  )
}

export default Live