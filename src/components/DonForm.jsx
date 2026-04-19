import React, { useState } from 'react';

const DonForm = () => {
  const [loading, setLoading] = useState(false);
  const [montant, setMontant] = useState("");
  const [nom, setNom] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Préparation des données pour l'API
    const paymentData = {
    item_name: "Don Chorale Saint Joseph",
    item_price: montant, // Assure-toi que c'est bien la variable de ton état (state)
    currency: "XOF",
    ref_command: "CMD_" + Date.now(),
    command_name: "Donation via Site",
    env: "test", // ⚠️ Garde "test" ici jusqu'à l'activation par PayTech
    success_url: `${window.location.origin}/merci`,
    cancel_url: `${window.location.origin}/`
};

    try {
      // Appel à ton fichier api/paytech.js sur Vercel
      const response = await fetch('/api/paytech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (data.redirect_url) {
        // Redirection vers la page de paiement PayTech (Orange Money, Wave, etc.)
        window.location.href = data.redirect_url;
      } else {
        // Si PayTech renvoie une erreur (ex: configuration)
        alert("Erreur PayTech : " + (data.error || "Vérifiez la configuration dans votre compte PayTech"));
        console.error("Détails erreur:", data);
      }
    } catch (error) {
      console.error("Erreur lors de la requête:", error);
      alert("Une erreur est survenue lors de la connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Faire un Don</h2>
      <form onSubmit={handlePayment} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Votre Nom</label>
          <input
            type="text"
            required
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Ex: Jean Paul"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Montant (FCFA)</label>
          <input
            type="number"
            required
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Ex: 5000"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-md text-white font-bold ${
            loading ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'
          } transition duration-200`}
        >
          {loading ? "Chargement..." : "Donner via Orange Money / Wave"}
        </button>
      </form>
      <p className="mt-4 text-xs text-gray-500 text-center">
        Paiement sécurisé via PayTech
      </p>
    </div>
  );
};

export default DonForm;