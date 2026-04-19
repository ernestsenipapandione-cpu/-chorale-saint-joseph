import React, { useState } from 'react'
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
      const paymentData = {
        item_name: "Don Chorale Saint Joseph",
        item_price: donForm.montant,
        currency: "XOF",
        ref_command: `DON-${Date.now()}`,
        command_name: `Don de ${donForm.nom}`,
        env: "live", // ⚠️ Assure-toi que ton app PayTech est en mode PROD
        success_url: `${window.location.origin}/merci?nom=${encodeURIComponent(donForm.nom)}&montant=${donForm.montant}&methode=${encodeURIComponent(methode)}`,
        cancel_url: `${window.location.origin}/`,
      };

      // 💡 AJOUT DU PROXY pour éviter l'erreur de configuration navigateur
      const proxyUrl = "https://corsproxy.io/?";
      const targetUrl = "https://paytech.sn/api/payment/request-payment";

      const response = await fetch(proxyUrl + targetUrl, {
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
        window.location.href = result.redirect_url;
      } else {
        // Affiche l'erreur précise venant de PayTech
        const errorMsg = result.errors ? result.errors[0] : "Vérifiez vos clés API et le domaine";
        toast.error("Erreur PayTech : " + errorMsg);
        console.error("Détails:", result);
      }

    } catch (err) {
      toast.error("Problème de connexion au serveur de paiement");
      console.error(err);
    } finally {
      setDonLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow p-8 border border-gray-100">
      <h3 className="text-2xl font-bold text-primary mb-2 text-center">💝 Soutenir la Chorale</h3>
      <p className="text-gray-500 text-center mb-6 text-sm">
        Remplissez les informations pour faire votre don
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
          <input 
            type="text" 
            value={donForm.nom}
            onChange={(e) => setDonForm({ ...donForm, nom: e.target.value })}
            placeholder="Ex: Ernest Faye"
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
            {donLoading ? '⏳ Connexion...' : '🟠 Orange Money'}
          </button>
          
          <button 
            onClick={() => handleDon('Wave')} 
            disabled={donLoading}
            className="w-full bg-[#1da1f2] text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {donLoading ? '⏳ Connexion...' : '🔵 Payer avec Wave'}
          </button>
        </div>

        <p className="text-[10px] text-gray-400 text-center mt-4 uppercase tracking-widest font-bold">
          PayTech Sénégal
        </p>
      </div>
    </div>
  )
}

export default DonForm