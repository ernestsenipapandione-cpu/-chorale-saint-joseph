import React, { useState } from 'react'
import Layout from '../components/Layout'

const Live = () => {
  // On fixe le nom de la salle sur ST-JOE par défaut
  const [roomName, setRoomName] = useState('ST-JOE')

  const handleJoin = () => {
    // On crée le lien Jitsi avec les options de confort
    const jitsiUrl = `https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false&config.disableDeepLinking=true`
    
    // On ouvre dans un nouvel onglet pour une stabilité maximale sur mobile
    window.open(jitsiUrl, '_blank')
  }

  return (
    <Layout>
      <div className="p-4 md:p-8 min-h-[80vh] flex items-center justify-center">
        
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 text-center max-w-md w-full">
          {/* Icône animée */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-primary opacity-10 rounded-full animate-ping"></div>
            <div className="relative bg-white border-2 border-primary rounded-full w-full h-full flex items-center justify-center text-4xl shadow-inner">
              🎤
            </div>
          </div>

          <h2 className="text-2xl font-black text-primary mb-2 uppercase">Répétition Live</h2>
          <p className="text-gray-500 text-sm mb-8">
            Cliquez ci-dessous pour rejoindre la salle de la chorale sur <strong>Jitsi Meet</strong>.
          </p>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-200">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nom de la salle</p>
              <p className="text-xl font-black text-primary tracking-widest">{roomName}</p>
            </div>

            <button
              onClick={handleJoin}
              className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition transform flex items-center justify-center gap-3"
            >
              🚀 ENTRER DANS LA SALLE
            </button>
          </div>

          <p className="text-[10px] text-gray-400 mt-8 leading-relaxed">
            Note : Si vous êtes sur mobile et que Jitsi demande d'installer l'app, choisissez simplement 
            <span className="font-bold"> "Continuer dans le navigateur"</span>.
          </p>
        </div>

      </div>
    </Layout>
  )
}

export default Live;