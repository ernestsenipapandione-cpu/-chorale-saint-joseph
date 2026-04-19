import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';

const Partitions = () => {
  const [partitions, setPartitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    titre: '',
    compositeur: '',
    voix: '',
    fichier_url: ''
  });

  useEffect(() => {
    fetchPartitions();
  }, []);

  const fetchPartitions = async () => {
    const { data, error } = await supabase
      .from('partitions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) toast.error('Erreur lors du chargement');
    else setPartitions(data || []);
  };

  const handleFileUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // UTILISATION DE "Partitions" AVEC MAJUSCULE ICI
      const { error: uploadError } = await supabase.storage
        .from('Partitions')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // RÉCUPÉRATION DE L'URL AVEC "Partitions" AUSSI
      const { data: urlData } = supabase.storage
        .from('Partitions')
        .getPublicUrl(filePath);

      setForm({ ...form, fichier_url: urlData.publicUrl });
      toast.success('Fichier uploadé avec succès !');
    } catch (error) {
      console.error(error);
      toast.error("Erreur Upload: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.fichier_url) {
      toast.error('Attendez que le fichier soit uploadé ou entrez un lien');
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('partitions')
      .insert([form]);

    if (error) {
      toast.error("Erreur Base de données: " + error.message);
    } else {
      toast.success('Partition ajoutée !');
      setForm({ titre: '', compositeur: '', voix: '', fichier_url: '' });
      fetchPartitions();
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Gestion des Partitions</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Titre de l'œuvre"
            className="p-2 border rounded"
            value={form.titre}
            onChange={(e) => setForm({...form, titre: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Compositeur"
            className="p-2 border rounded"
            value={form.compositeur}
            onChange={(e) => setForm({...form, compositeur: e.target.value})}
          />
          <select 
            className="p-2 border rounded"
            value={form.voix}
            onChange={(e) => setForm({...form, voix: e.target.value})}
            required
          >
            <option value="">Choisir la voix</option>
            <option value="Soprano">Soprano</option>
            <option value="Alto">Alto</option>
            <option value="Ténor">Ténor</option>
            <option value="Basse">Basse</option>
            <option value="Tout le chœur">Tout le chœur</option>
          </select>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">Télécharger le fichier :</label>
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={uploading}
              className="text-sm"
            />
            {uploading && <span className="text-blue-500">Upload en cours...</span>}
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={loading || uploading}
          className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : 'Ajouter la partition'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {partitions.map((part) => (
          <div key={part.id} className="bg-white p-4 rounded shadow border-l-4 border-indigo-500">
            <h3 className="font-bold text-lg">{part.titre}</h3>
            <p className="text-gray-600">{part.compositeur}</p>
            <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded mt-2">
              {part.voix}
            </span>
            <div className="mt-4">
              <a 
                href={part.fichier_url} 
                target="_blank" 
                rel="noreferrer"
                className="text-indigo-600 hover:underline font-medium"
              >
                Voir le fichier 📄
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Partitions;