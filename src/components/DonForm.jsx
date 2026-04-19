import React, { useState } from 'react'
import toast from 'react-hot-toast'

const DonForm = () => {
  const [donForm, setDonForm] = useState({ nom: '', montant: '' })
  const [donLoading, setDonLoading] = useState(false)

  const handleDon = async () => {
    if (!donForm.nom || !donForm.montant) {
      toast.error('Remplissez le nom et le montant !')
      return
    }

    setDonLoading(true)
    try {
      const response = await fetch("/api/paytech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_name: "Soutien Chorale",
          item_price: donForm.montant,
          currency: "XOF",
          ref_command: `REF-${Date.now()}`,
          command_name: `Don de ${donForm.nom}`,
          env: "live", // On reste en live si ton domaine est configuré
          success_url: `${window.location.origin}/merci`,
          cancel_url: `${window.location.origin}/`
        })
      })

      const result = await response.json()
      if (result.success === 1) {
        window.location.href = result.redirect_url
      } else {
        toast.error("Erreur : " + (result.errors ? result.errors[0] : "Vérifiez vos clés PayTech"))
      }
    } catch (err) {
      toast.error("Le serveur ne répond pas")
    } finally {
      setDonLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm mx-auto">
      <h3 className="text-xl font-bold text-center mb-4">Faire un Don 💝</h3>
      <input 
        type="text" placeholder="Votre nom" 
        className="w-full p-3 border rounded mb-3"
        onChange={(e) => setDonForm({...donForm, nom: e.target.value})}
      />
      <input 
        type="number" placeholder="Montant FCFA" 
        className="w-full p-3 border rounded mb-6"
        onChange={(e) => setDonForm({...donForm, montant: e.target.value})}
      />
      <button 
        onClick={handleDon}
        disabled={donLoading}
        className="w-full bg-orange-500 text-white py-4 rounded-lg font-bold"
      >
        {donLoading ? "Connexion..." : "Payer maintenant"}
      </button>
    </div>
  )
}

export default DonForm