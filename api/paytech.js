export default async function handler(req, res) {
  // On n'autorise que les requêtes POST (envoi de données)
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const API_KEY = "02a4e8c67fd77c1468cbfefea15d3fe6f66ff8b190a37559decc760d92028626";
  const API_SECRET = "cc98f7e3c833a1a79eaf0666644a0ce87814fe64a5a486c195d00800ba800a60";

  try {
    const response = await fetch("https://paytech.sn/api/payment/request-payment", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "API_KEY": API_KEY,
        "API_SECRET": API_SECRET
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    
    // On renvoie la réponse de PayTech à ton site
    return res.status(200).json(data);
  } catch (error) {
    console.error("Erreur API PayTech:", error);
    return res.status(500).json({ error: "Erreur lors de la communication avec le serveur de paiement" });
  }
}