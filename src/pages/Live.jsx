import React, { useState } from 'react'
import Layout from '../components/Layout'

const Live = () => {
  const [started, setStarted] = useState(false)
  const [roomName, setRoomName] = useState('chorale-saint-joseph')

  const startMeeting = () => {
    // Nettoyage du nom de la salle (minuscules, pas d'espaces)
    const cleanRoomName = roomName.trim().replace(/\s+/g, '-').toLowerCase()
    setRoomName(cleanRoomName)
    setStarted(true)
  }

  return (
    <Layout>
      <div className="p-4 md:p-6 h-full min-h-[80vh]">

        {/* Titre - Uniquement si le live n'est pas lancé */}
        {!started && (
          <div className="mb-6">
            <h2 className="text-2xl font-black text-primary flex items-center gap-2">
              🎬 Répétition Live
            </h2>
            <p className="text-gray-500">Espace de visioconférence de la chorale</p>
          </div>
        )}

        {!started ? (
          /* ÉCRAN D'ACCUEIL AVANT LE LIVE */
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 text-center max-w-lg mx-auto">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🎤</span>
            </div>
            <h3 className="text-xl font-black text-primary mb-2">
              Prêt pour la répétition ?
            </h3>
            <p className="text-gray-500 text-sm mb-8">
              Rejoignez la salle en un clic. Pas besoin de télécharger d'application externe.
            </p>

            <div className="mb-6 text-left">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">
                Nom de la salle de répétition
              </label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary font-bold text-primary"
              />
            </div>

            <button
              onClick={startMeeting}
              className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-blue-100 hover:scale-[1.02] transition transform active:scale-95"
            >
              🎬 Entrer dans la salle
            </button>

            {/* Badges de confiance */}
            <div className="grid grid-cols-3 gap-3 mt-10">
              <div className="bg-blue-50 rounded-2xl p-3">
                <p className="text-[10px] font-black text-blue-600 uppercase">HD Vidéo</p>
              </div>
              <div className="bg-purple-50 rounded-2xl p-3">
                <p className="text-[10px] font-black text-purple-600 uppercase">Gratuit</p>
              </div>
              <div className="bg-green-50 rounded-2xl p-3">
                <p className="text-[10px] font-black text-green-600 uppercase">Privé</p>
              </div>
            </div>
          </div>
        ) : (
          /* L'INTERFACE DU LIVE EN COURS */
          <div className="bg-black rounded-3xl shadow-2xl overflow-hidden h-[75vh] md:h-[85vh] flex flex-col border-4 border-gray-900">
            
            {/* Barre de contrôle supérieure */}
            <div className="bg-gray-900 text-white px-5 py-3 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                </span>
                <span className="text-xs font-black uppercase tracking-widest truncate max-w-[150px]">
                  Direct : {roomName}
                </span>
              </div>
              <button
                onClick={() => setStarted(false)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-xl text-xs font-black transition uppercase tracking-tighter"
              >
                Quitter
              </button>
            </div>
            
            {/* L'IFRAME JITSI OPTIMISÉE */}
            <iframe
              /* On ajoute les paramètres à la fin de l'URL pour supprimer les messages inutiles */
              src={`https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false&config.disableDeepLinking=true&interfaceConfig.LANG_DETECTION=false&interfaceConfig.DEFAULT_LOCAL_DISPLAY_NAME="Membre Chorale"`}
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