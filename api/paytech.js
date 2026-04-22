export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  // --- CONFIGURATION LIVE ---
  // Remplace ces valeurs par tes clés de PRODUCTION si nécessaire
  const API_KEY = "b00366156ac87ebaf7892bd462e3d7f6f00e7affe9b4024c764a7132429e5e6b"; 
  const API_SECRET = "c9d71a1b5fa3c896cb52b140715b3a5c94da096f4f8090d0b0d058d0e16897d6";

  try {
    const response = await fetch("https://paytech.sn/api/payment/request-payment", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "API_KEY": API_KEY,
        "API_SECRET": API_SECRET
      },
      body: JSON.stringify({
        item_name: req.body.item_name,
        item_price: String(req.body.item_price), 
        currency: "XOF",
        ref_command: req.body.ref_command,
        command_name: req.body.command_name,
        // PASSAGE EN MODE LIVE FORCE
        env: "live", 
        success_url: req.body.success_url,
        cancel_url: req.body.cancel_url,
        custom_field: req.body.custom_field || ""
      })
    });

    const data = await response.json();

    // Log pour vérifier la réponse en cas de problème sur Vercel
    console.log("Statut PayTech (LIVE):", data.success === 1 ? "SUCCÈS" : "ÉCHEC");
    
    if (data.success !== 1) {
      console.error("Détails de l'erreur PayTech:", data.errors || data.message);
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error("Erreur API Route:", error);
    return res.status(500).json({ 
      error: "Erreur de communication avec le serveur de paiement",
      details: error.message 
    });
  }
}