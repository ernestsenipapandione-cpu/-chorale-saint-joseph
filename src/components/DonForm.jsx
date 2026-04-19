import React, { useState } from 'react'
import toast from 'react-hot-toast'

const DonForm = () => {
  const [donForm, setDonForm] = useState({ nom: '', telephone: '', montant: '' })
  const [donLoading, setDonLoading] = useState(false)

  const handleDon = async () => {
    if (!donForm.nom || !donForm.montant) {
      toast.error('Veuillez remplir votre nom et le montant !')
      return
    }

    setDonLoading(true)

    try {
      const paymentData = {
        item_name: "Don Chorale",
        item_price: donForm.montant,
        currency: "XOF",
        ref_command: `DON-${Date.now()}`,
        command_name: `Don de ${donForm.nom}`,
        env: "live", 
        success_url: `${window.location.origin}/merci`,
        cancel_url: `${window.location.origin}/`
      };

      const response = await fetch("/api/paytech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (result.success === 1) {
        window.location.href = result.redirect_url;
      } else {
        const errorMsg = result.errors ? result.errors[0] : "Erreur de configuration";
        toast.error("Paiement : " + errorMsg);
      }

    } catch (err) {
      toast.error("Le serveur ne répond pas.");
    } finally {
      setDonLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow p-8 border border-gray-100 max-w-md mx-auto">
      <h3 className="text-2xl font-bold text-primary mb-2 text-center">💝 Soutenir la Chorale</h3>
      <p className="text-gray-500 text-center mb-6 text-sm">Entrez vos informations pour le don</p>

      <div className="space-y-4">
        <input 
          type="text" placeholder="Nom complet" 
          value={donForm.nom}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none"
          onChange={(e) => setDonForm({...donForm, nom: e.target.value})}
        />
        
        <input 
          type="text" placeholder="Téléphone" 
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
            onClick={handleDon}
            disabled={donLoading}
            className="w-full bg-[#FF7900] text-white py-4 rounded-xl font-bold disabled:opacity-50"
          >
            {donLoading ? '⏳ Connexion...' : '🟠 Payer avec Orange Money'}
          </button>
          <button 
            onClick={handleDon}
            disabled={donLoading}
            className="w-full bg-[#1da1f2] text-white py-4 rounded-xl font-bold disabled:opacity-50"
          >
            {donLoading ? '⏳ Connexion...' : '🔵 Payer avec Wave'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DonForm