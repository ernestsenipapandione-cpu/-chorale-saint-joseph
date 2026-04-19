import React, { useState } from 'react'
import toast from 'react-hot-toast'

const DonForm = () => {
  const [donForm, setDonForm] = useState({ nom: '', telephone: '', montant: '' })
  const [donLoading, setDonLoading] = useState(false)

  const handleDon = async (methode) => {
    // Vérification de base
    if (!donForm.nom || !donForm.montant) {
      toast.error('Veuillez remplir votre nom et le montant !')
      return
    }

    setDonLoading(true)

    try {
      const paymentData = {
        item_name: "Don Chorale Saint Joseph",
        item_price: donForm.montant,
        currency: "XOF",
        ref_command: `DON-${Date.now()}`,
        command_name: `Don de ${donForm.nom}`,
        env: "test", // 🚀 PASSAGE EN MODE RÉEL (LIVE)
        success_url: `${window.location.origin}/merci`,
        cancel_url: `${window.location.origin}/`,
        customer_phone: donForm.telephone 
      };

      // 🚀 APPEL À TON API VERCEL (api/paytech.js)
      const response = await fetch("/api/paytech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (result.success === 1) {
        // ✅ Redirection vers la plateforme de paiement réelle
        window.location.href = result.redirect_url;
      } else {
        // ❌ Erreur renvoyée par PayTech (ex: compte non validé)
        const errorMsg = result.errors ? result.errors[0] : "Erreur de configuration";
        toast.error("Paiement : " + errorMsg);
        console.error("Détails PayTech:", result);
      }

    } catch (err) {
      console.error("Erreur technique:", err);
      toast.error("Le service de paiement est indisponible actuellement.");
    } finally {
      setDonLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 max-w-md mx-auto">
      <h3 className="text-2xl font-bold text-primary mb-2 text-center">💝 Soutenir la Chorale</h3>
      <p className="text-gray-500 text-center mb-8 text-sm">Votre générosité nous aide à embellir nos célébrations</p>

      <div className="space-y-4">
        {/* Champ Nom */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
          <input 
            type="text" 
            placeholder="Ex: Jean Dupont" 
            value={donForm.nom}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
            onChange={(e) => setDonForm({...donForm, nom: e.target.value})}
          />
        </div>

        {/* Champ Téléphone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone (Optionnel)</label>
          <input 
            type="text" 
            placeholder="Ex: 771234567" 
            value={donForm.telephone}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
            onChange={(e) => setDonForm({...donForm, telephone: e.target.value})}
          />
        </div>

        {/* Champ Montant */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Montant du don (FCFA)</label>
          <input 
            type="number" 
            placeholder="Montant en FCFA" 
            value={donForm.montant}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
            onChange={(e) => setDonForm({...donForm, montant: e.target.value})}
          />
        </div>

        {/* Boutons de paiement */}
        <div className="grid grid-cols-1 gap-4 mt-8">
          <button 
            onClick={() => handleDon('Orange Money')}
            disabled={donLoading}
            className="w-full bg-[#FF7900] text-white py-4 rounded-xl font-bold hover:bg-[#e66d00] transition-colors shadow-lg disabled:opacity-50"
          >
            {donLoading ? '⏳ Traitement en cours...' : '🟠 Payer avec Orange Money'}
          </button>
          
          <button 
            onClick={() => handleDon('Wave')}
            disabled={donLoading}
            className="w-full bg-[#1da1f2] text-white py-4 rounded-xl font-bold hover:bg-[#1a91da] transition-colors shadow-lg disabled:opacity-50"
          >
            {donLoading ? '⏳ Traitement en cours...' : '🔵 Payer avec Wave'}
          </button>
        </div>

        <p className="text-[10px] text-gray-400 text-center mt-4">
          Paiement sécurisé via PayTech Sénégal
        </p>
      </div>
    </div>
  )
}

export default DonForm