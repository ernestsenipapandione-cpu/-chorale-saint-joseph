import React, { useState } from 'react'
import { supabase } from '../supabase/client'
import toast from 'react-hot-toast'

const DonForm = () => {
  const [donForm, setDonForm] = useState({
    nom: '', telephone: '', montant: '',
  })
  const [donLoading, setDonLoading] = useState(false)
  const [donSubmitted, setDonSubmitted] = useState(false)

  // ==========================================
  // CONFIGURATION PAYTECH (À REMPLIR)
  // ==========================================
  const API_KEY = "02a4e8c67fd77c1468cbfefea15d3fe6f66ff8b190a37559decc760d92028626"; // Ta clé publique
  const API_SECRET = "cc98f7e3c833a1a79eaf0666644a0ce87814fe64a5a486c195d00800ba800a60"; // Colle ta clé secrète ici
  // ==========================================

  const handleDon = async (methode) => {
    if (!donForm.nom || !donForm.montant) {
      toast.error('Veuillez remplir votre nom et le montant !')
      return
    }

    setDonLoading(true)

    try {
      // 1. On enregistre d'abord la trace du don dans Supabase
      const { error: dbError } = await supabase.from('finances').insert([{
        titre: `Don de ${donForm.nom}`,
        type: 'Entrée',
        montant: parseFloat(donForm.montant),
        description: `Tentative de don via ${methode} - Tel: ${donForm.telephone}`,
        date: new Date().toISOString().split('T')[0],
      }])

      if (dbError) throw new Error("Erreur base de données: " + dbError.message)

      // 2. On prépare les données pour PayTech
      const paymentData = {
        item_name: "Don Chorale Saint Joseph",
        item_price: donForm.montant,
        currency: "XOF",
        ref_command: `DON-${Date.now()}`, // Identifiant unique
        command_name: `Don de ${donForm.nom} (${donForm.telephone})`,
        env: "test", // ⚠️ REMPLACE "test" PAR "live" QUAND TU VEUX RECEVOIR DU VRAI ARGENT
        success_url: window.location.origin + "/merci",
        ipn_url: window.location.origin + "/api/paytech-callback"
      };

      // 3. Appel à l'API de PayTech
      const response = await fetch("https://paytech.sn/api/payment/request-payment", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "API_KEY": API_KEY,
          "API_SECRET": API_SECRET
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (result.success === 1) {
        // Redirection vers la page de paiement (Orange Money, Wave, etc.)
        window.location.href = result.redirect_url;
      } else {
        const errorMsg = result.errors ? result.errors[0] : "Erreur de configuration API";
        toast.error("Erreur PayTech : " + errorMsg);
      }

    } catch (err) {
      toast.error("Impossible de lancer le paiement : " + err.message);
      console.error(err);
    } finally {
      setDonLoading(false)
    }
  }

  if (donSubmitted) {
    return (
      <div className="bg-white rounded-2xl shadow p-8 text-center">
        <span className="text-6xl block mb-4">🙏</span>
        <h3 className="text-2xl font-bold text-primary mb-2">Merci pour votre don !</h3>
        <p className="text-gray-500 mb-6">Votre générosité aide la Chorale Saint Joseph. 🎵</p>
        <button 
          onClick={() => setDonSubmitted(false)} 
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition"
        >
          Faire un autre don
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow p-8 border border-gray-100">
      <h3 className="text-2xl font-bold text-primary mb-2 text-center">💝 Soutenir la Chorale</h3>
      <p className="text-gray-500 text-center mb-6 text-sm">
        Choisissez votre mode de paiement préféré
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
          <input 
            type="text" 
            value={donForm.nom}
            onChange={(e) => setDonForm({ ...donForm, nom: e.target.value })}
            placeholder="Ex: Jean Dupont"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input 
            type="text" 
            value={donForm.telephone}
            onChange={(e) => setDonForm({ ...donForm, telephone: e.target.value })}
            placeholder="77 000 00 00"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Montant (FCFA)</label>
          <input 
            type="number" 
            value={donForm.montant}
            onChange={(e) => setDonForm({ ...donForm, montant: e.target.value })}
            placeholder="5000"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" 
          />
        </div>

        <div className="grid grid-cols-1 gap-3 mt-6">
          <button 
            onClick={() => handleDon('Orange Money')} 
            disabled={donLoading}
            className="w-full bg-[#FF7900] text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {donLoading ? '⏳ Connexion...' : '🟠 Payer avec Orange Money'}
          </button>
          
          <button 
            onClick={() => handleDon('Wave')} 
            disabled={donLoading}
            className="w-full bg-[#1da1f2] text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {donLoading ? '⏳ Connexion...' : '🔵 Payer avec Wave'}
          </button>
        </div>

        <p className="text-[10px] text-gray-400 text-center mt-4 uppercase tracking-widest">
          Sécurisé par PayTech Sénégal
        </p>
      </div>
    </div>
  )
}

export default DonForm