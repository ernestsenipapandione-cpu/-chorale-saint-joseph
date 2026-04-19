import React, { useState } from 'react'
import toast from 'react-hot-toast'

const DonForm = () => {
  const [donForm, setDonForm] = useState({ nom: '', telephone: '', montant: '' })
  const [donLoading, setDonLoading] = useState(false)

  const API_KEY = "02a4e8c67fd77c1468cbfefea15d3fe6f66ff8b190a37559decc760d92028626";
  const API_SECRET = "cc98f7e3c833a1a79eaf0666644a0ce87814fe64a5a486c195d00800ba800a60";

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
        env: "live", 
        success_url: `${window.location.origin}/merci`,
        cancel_url: `${window.location.origin}/`,
      };

      // ✅ UTILISATION D'UN PROXY PLUS STABLE
      const targetUrl = "https://paytech.sn/api/payment/request-payment";
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

      const response = await fetch(proxyUrl, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "API_KEY": API_KEY,
          "API_SECRET": API_SECRET
        },
        // Avec AllOrigins, on envoie parfois les données différemment, 
        // mais essayons d'abord la méthode standard POST
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();
      
      // AllOrigins renvoie souvent le résultat dans data.contents
      const result = typeof data.contents === 'string' ? JSON.parse(data.contents) : data;

      if (result.success === 1) {
        window.location.href = result.redirect_url;
      } else {
        const errorMsg = result.errors ? result.errors[0] : "Erreur de configuration";
        toast.error("PayTech : " + errorMsg);
        console.error("Réponse PayTech:", result);
      }

    } catch (err) {
      console.error("Erreur complète:", err);
      toast.error("Connexion impossible. Vérifie ton domaine sur PayTech.");
    } finally {
      setDonLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow p-8 border border-gray-100">
      <h3 className="text-2xl font-bold text-primary mb-2 text-center">💝 Soutenir la Chorale</h3>
      <p className="text-gray-500 text-center mb-6 text-sm">Remplissez les informations pour votre don</p>

      <div className="space-y-4">
        <input 
          type="text" placeholder="Nom complet" 
          value={donForm.nom}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none"
          onChange={(e) => setDonForm({...donForm, nom: e.target.value})}
        />
        <input 
          type="number" placeholder="Montant (FCFA)" 
          value={donForm.montant}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none"
          onChange={(e) => setDonForm({...donForm, montant: e.target.value})}
        />

        <div className="grid grid-cols-1 gap-3 mt-6">
          <button 
            onClick={() => handleDon('Orange Money')}
            disabled={donLoading}
            className="w-full bg-[#FF7900] text-white py-4 rounded-xl font-bold disabled:opacity-50"
          >
            {donLoading ? '⏳ Connexion...' : '🟠 Orange Money'}
          </button>
          <button 
            onClick={() => handleDon('Wave')}
            disabled={donLoading}
            className="w-full bg-[#1da1f2] text-white py-4 rounded-xl font-bold disabled:opacity-50"
          >
            {donLoading ? '⏳ Connexion...' : '🔵 Wave'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DonForm