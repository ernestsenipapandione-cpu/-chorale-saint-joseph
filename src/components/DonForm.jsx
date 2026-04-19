import React, { useState } from 'react'
import { supabase } from '../supabase/client'
import toast from 'react-hot-toast'

const DonForm = () => {
  const [donForm, setDonForm] = useState({
    nom: '', 
    telephone: '', 
    montant: '',
  })
  const [donLoading, setDonLoading] = useState(false)

  // ==========================================
  // CONFIGURATION PAYTECH
  // ==========================================
  const API_KEY = "02a4e8c67fd77c1468cbfefea15d3fe6f66ff8b190a37559decc760d92028626";
  const API_SECRET = "cc98f7e3c833a1a79eaf0666644a0ce87814fe64a5a486c195d00800ba800a60"; 
  // ==========================================

  const handleDon = async (methode) => {
    if (!donForm.nom || !donForm.montant) {
      toast.error('Veuillez remplir votre nom et le montant !')
      return
    }

    setDonLoading(true)

    try {
      // Préparation des données pour PayTech
      // On passe le nom et le montant dans l'URL de succès pour les enregistrer plus tard
      const paymentData = {
        item_name: "Don Chorale Saint Joseph",
        item_price: donForm.montant,
        currency: "XOF",
        ref_command: `DON-${Date.now()}`,
        command_name: `Don de ${donForm.nom}`,
        env: "live", 
        success_url: `${window.location.origin}/merci?nom=${encodeURIComponent(donForm.nom)}&montant=${donForm.montant}&methode=${encodeURIComponent(methode)}`,
        cancel_url: `${window.location.origin}/`,
        ipn_url: window.location.origin + "/api/paytech-callback"
      };

      // Appel à PayTech
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
        // Redirection vers Orange Money / Wave
        window.location.href = result.redirect_url;
      } else {
        const errorMsg = result.errors ? result.errors[0] : "Erreur de configuration";
        toast.error("Erreur PayTech : " + errorMsg);
      }

    } catch (err) {
      toast.error("Impossible de joindre le service de paiement");
      console.error(err);
    } finally {
      setDonLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow p-8 border border-gray-100">
      <h3 className="text-2xl font-bold text-primary mb-2 text-center">💝 Soutenir la Chorale</h3>
      <p className="text-gray-500 text-center mb-6 text-sm">
        Votre don sera enregistré après confirmation du paiement
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
          Système sécurisé PayTech Sénégal
        </p>
      </div>
    </div>
  )
}

export default DonForm