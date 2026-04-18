import React, { useState } from 'react'
import { supabase } from '../supabase/client'
import toast from 'react-hot-toast'

const DonForm = () => {
  const [donForm, setDonForm] = useState({
    nom: '', telephone: '', montant: '',
  })
  const [donLoading, setDonLoading] = useState(false)
  const [donSubmitted, setDonSubmitted] = useState(false)
  const NUMERO_PAIEMENT = '221788222596'

  const handleDon = async (methode) => {
    if (!donForm.nom || !donForm.montant) {
      toast.error('Veuillez remplir votre nom et le montant !')
      return
    }
    setDonLoading(true)
    const { error } = await supabase.from('finances').insert([{
      titre: `Don de ${donForm.nom}`,
      type: 'Entrée',
      montant: parseFloat(donForm.montant),
      description: `Don via ${methode} - Tel: ${donForm.telephone || 'Non précisé'}`,
      date: new Date().toISOString().split('T')[0],
    }])
    if (error) {
      toast.error('Erreur : ' + error.message)
    } else {
      if (methode === 'Wave') {
        window.open(`https://wave.com/send?phone=${NUMERO_PAIEMENT}&amount=${donForm.montant}`, '_blank')
      } else {
        window.open(`https://www.orange.sn/orangemoney`, '_blank')
      }
      setDonSubmitted(true)
      toast.success('Don enregistré ! Merci 🙏')
    }
    setDonLoading(false)
  }

  if (donSubmitted) {
    return (
      <div className="bg-white rounded-2xl shadow p-8 text-center">
        <span className="text-6xl block mb-4">🙏</span>
        <h3 className="text-2xl font-bold text-primary mb-2">Merci pour votre don !</h3>
        <p className="text-gray-500 mb-2">
          Votre générosité aide la Chorale Saint Joseph à continuer sa mission.
        </p>
        <p className="text-gray-500 mb-6">Que Dieu vous bénisse ! 🎵</p>
        <button
          onClick={() => {
            setDonSubmitted(false)
            setDonForm({ nom: '', telephone: '', montant: '' })
          }}
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition">
          Faire un autre don
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow p-8">
      <h3 className="text-2xl font-bold text-primary mb-2 text-center">💝 Faire un don</h3>
      <p className="text-gray-500 text-center mb-6">
        Soutenez la Chorale Saint Joseph avec votre don
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Votre nom</label>
          <input type="text" value={donForm.nom}
            onChange={(e) => setDonForm({ ...donForm, nom: e.target.value })}
            required placeholder="Jean Dupont"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input type="text" value={donForm.telephone}
            onChange={(e) => setDonForm({ ...donForm, telephone: e.target.value })}
            placeholder="+221 XX XXX XX XX"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Montant (FCFA)</label>
          <input type="number" value={donForm.montant}
            onChange={(e) => setDonForm({ ...donForm, montant: e.target.value })}
            required placeholder="1000"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Montants suggérés :</p>
          <div className="grid grid-cols-4 gap-2">
            {[1000, 2000, 5000, 10000].map((montant) => (
              <button key={montant}
                onClick={() => setDonForm({ ...donForm, montant: montant.toString() })}
                className="bg-gray-100 text-gray-700 py-2 rounded-xl text-sm font-semibold hover:bg-primary hover:text-white transition">
                {montant.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <button onClick={() => handleDon('Orange Money')} disabled={donLoading}
            className="bg-orange-500 text-white py-4 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-50">
            🟠 Orange Money
          </button>
          <button onClick={() => handleDon('Wave')} disabled={donLoading}
            className="bg-blue-500 text-white py-4 rounded-xl font-semibold hover:bg-blue-600 transition disabled:opacity-50">
            🔵 Wave
          </button>
        </div>
        {donLoading && (
          <p className="text-center text-primary font-medium">⏳ Traitement en cours...</p>
        )}
        <div className="bg-gray-50 rounded-xl p-4 mt-4">
          <p className="text-sm text-gray-500 text-center">
            🔒 Paiement sécurisé via Orange Money ou Wave
          </p>
          <p className="text-sm text-gray-500 text-center mt-1">
            📞 Numéro : +221 78 822 25 96
          </p>
        </div>
      </div>
    </div>
  )
}

export default DonForm