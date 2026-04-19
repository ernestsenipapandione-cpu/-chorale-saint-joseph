import React, { useState } from 'react'
import toast from 'react-hot-toast'

const DonForm = () => {
  const [donForm, setDonForm] = useState({ nom: '', telephone: '', montant: '' })
  const [donLoading, setDonLoading] = useState(false)

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
        env: "live", // 🚀 MODE RÉEL ACTIVÉ
        success_url: `${window.location.origin}/merci`,
        cancel_url: `${window.location.origin}/`,
        customer_phone: donForm.telephone 
      };

      // Appel vers ton API Serverless sur Vercel
      const response = await fetch("/api/paytech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (result.success === 1) {
        // Redirection vers la page de paiement réelle (Orange Money, Wave, etc.)
        window.location.href = result.redirect_url;
      } else {
        const errorMsg = result.errors ? result.errors[0] : "Erreur de configuration";
        toast.error("Paiement : " + errorMsg);
        console.log("Détails PayTech:", result);
      }

    } catch (err) {
      console.error("Erreur:", err);
      toast.error("Impossible de joindre le service de paiement.");
    } finally {
      setDonLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow p-8 border border-gray-100">
      <h3 className="text-2xl font-bold text-primary mb-2 text-center">💝 Soutenir la Chorale</h3>
      <p className="text-gray-500 text-center mb-6 text-sm">Votre soutien nous aide à grandir</p>

      <div className="space-y-4">
        <input 
          type="text" placeholder="Nom complet" 
          value={donForm.nom}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none"
          onChange={(e) => setDonForm({...donForm, nom: e.target.value})}
        />
        
        <input 
          type="text" placeholder="Téléphone (ex: 771234567)" 
          value={donForm.telephone}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none"
          onChange={(e) => setDonForm({...donForm, telephone: e.target.value})}
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
            className="w-full bg-[#FF7900] text-white py-4 rounded-xl font-bold hover:bg-[#e66d00] transition-colors disabled:opacity-50"
          >
            {donLoading ? '⏳ Connexion...' : '🟠 Payer avec Orange Money'}
          </button>
          <button 
            onClick={() => handleDon('Wave')}
            disabled={donLoading}
            className="w-full bg-[#1da1f2] text-white py-4 rounded-xl font-bold hover:bg-[#1a91da] transition-colors disabled:opacity-50"
          >
            {donLoading ? '⏳ Connexion...' : '🔵 Payer avec Wave'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DonForm