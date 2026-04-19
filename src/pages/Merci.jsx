import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../supabase/client';

const Merci = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'

  useEffect(() => {
    const saveDonation = async () => {
      // 1. On récupère les informations envoyées dans l'URL par PayTech
      const nom = searchParams.get('nom');
      const montant = searchParams.get('montant');
      const methode = searchParams.get('methode');

      if (nom && montant) {
        try {
          // 2. On insère le don dans la table finances
          const { error } = await supabase.from('finances').insert([{
            titre: `Don de ${nom}`,
            type: 'Entrée',
            montant: parseFloat(montant),
            description: `Don validé avec succès via ${methode}`,
            date: new Date().toISOString().split('T')[0],
          }]);

          if (error) throw error;

          // Si tout est bon, on affiche le message de succès
          setStatus('success');
        } catch (err) {
          console.error("Erreur d'enregistrement Supabase:", err);
          setStatus('error');
        }
      } else {
        // Si les paramètres sont absents (ex: quelqu'un tape l'URL à la main)
        setStatus('error');
      }
    };

    saveDonation();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-100">
        
        {/* CAS 1 : EN COURS DE VALIDATION */}
        {status === 'processing' && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-700">Validation en cours...</h2>
            <p className="text-gray-500">Nous enregistrons votre don dans la base de données de la chorale.</p>
          </div>
        )}

        {/* CAS 2 : SUCCÈS */}
        {status === 'success' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-7xl">🙏</div>
            <h2 className="text-3xl font-bold text-green-600">Merci du fond du cœur !</h2>
            <div className="bg-green-50 p-4 rounded-2xl text-green-800">
              <p className="font-medium">Paiement validé avec succès.</p>
              <p className="text-sm mt-1">Votre soutien aide la chorale à grandir.</p>
            </div>
            <p className="text-gray-500">Que la paix du Seigneur soit avec vous.</p>
          </div>
        )}

        {/* CAS 3 : ERREUR */}
        {status === 'error' && (
          <div className="space-y-6">
            <div className="text-7xl">⚠️</div>
            <h2 className="text-2xl font-bold text-red-500">Une erreur est survenue</h2>
            <p className="text-gray-600">
              Nous n'avons pas pu enregistrer automatiquement le don. 
              Si vous avez été débité, ne vous inquiétez pas, contactez l'administrateur.
            </p>
          </div>
        )}

        {/* BOUTON RETOUR DANS TOUS LES CAS */}
        <div className="mt-10">
          <Link 
            to="/" 
            className="inline-block w-full bg-primary hover:bg-blue-800 text-white font-bold py-4 rounded-2xl shadow-lg transition duration-300 transform hover:scale-105"
          >
            Retour au Tableau de Bord
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Merci;