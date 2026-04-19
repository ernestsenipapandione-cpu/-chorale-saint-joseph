import React, { useState } from 'react';
import toast from 'react-hot-toast';

const DonForm = () => {
  const [donForm, setDonForm] = useState({ nom: '', montant: '' });
  const [donLoading, setDonLoading] = useState(false);

  const handleDon = async () => {
    if (!donForm.nom || !donForm.montant) {
      toast.error('Veuillez remplir le nom et le montant !');
      return;
    }

    setDonLoading(true);

    try {
      const response = await fetch("/api/paytech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_name: "Don Chorale",
          item_price: donForm.montant,
          currency: "XOF",
          ref_command: `DON-${Date.now()}`,
          command_name: `Don de ${donForm.nom}`,
          env: "live",
          success_url: `${window.location.origin}/merci`,
          cancel_url: `${window.location.origin}/`
        })
      });

      const result = await response.json();

      if (result.success === 1) {
        window.location.href = result.redirect_url;
      } else {
        toast.error("Erreur PayTech : " + (result.errors ? result.errors[0] : "Configuration"));
      }
    } catch (err) {
      toast.error("Erreur de connexion.");
    } finally {
      setDonLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-md mx-auto">
      <h3 className="text-xl font-bold text-center mb-4 text-blue-900">Faire un don 💝</h3>
      <div className="space-y-4">
        <input 
          type="text" placeholder="Votre nom" 
          className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
          onChange={(e) => setDonForm({...donForm, nom: e.target.value})}
        />
        <input 
          type="number" placeholder="Montant (FCFA)" 
          className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
          onChange={(e) => setDonForm({...donForm, montant: e.target.value})}
        />
        <button 
          onClick={handleDon}
          disabled={donLoading}
          className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-all disabled:opacity-50"
        >
          {donLoading ? '⏳ Chargement...' : 'Payer avec Orange Money / Wave'}
        </button>
      </div>
    </div>
  );
};

export default DonForm;