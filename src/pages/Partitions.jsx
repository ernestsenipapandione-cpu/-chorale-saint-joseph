import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
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

  // NOUVELLE FONCTION : SUPPRIMER
  const handleDelete = async (id, url) => {
    if (window.confirm("Supprimer cette partition définitivement ?")) {
      try {
        // 1. Extraire le nom du fichier depuis l'URL pour le supprimer du Storage
        const fileName = url.split('/').pop();
        
        // 2. Supprimer du stockage
        await supabase.storage
          .from('partitions')
          .remove([fileName]);

        // 3. Supprimer de la table
        const { error } = await supabase
          .from('partitions')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast.success('Partition supprimée');
        fetchPartitions(); // Actualiser la liste
      } catch (error) {
        toast.error("Erreur suppression: " + error.message);
      }
    }
  };

  const handleFileUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('partitions')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('partitions')
        .getPublicUrl(filePath);

      setForm({ ...form, fichier_url: urlData.publicUrl });
      toast.success('Fichier uploadé !');
    } catch (error) {
      toast.error("Erreur Upload: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fichier_url) return toast.error("Veuillez uploader un fichier d'abord");
    
    setLoading(true);
    const { error } = await supabase.from('partitions').insert([form]);
    if (error) toast.error(error.message);
    else {
      toast.success('Partition ajoutée !');
      setForm({ titre: '', compositeur: '', voix: '', fichier_url: '' });
      fetchPartitions();
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Partitions</h2>
      
      {/* Formulaire d'ajout */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Titre" className="p-2 border rounded" value={form.titre} onChange={(e) => setForm({...form, titre: e.target.value})} required />
          <input type="text" placeholder="Compositeur" className="p-2 border rounded" value={form.compositeur} onChange={(e) => setForm({...form, compositeur: e.target.value})} />
          <select className="p-2 border rounded" value={form.voix} onChange={(e) => setForm({...form, voix: e.target.value})} required>
            <option value="">Choisir la voix</option>
            <option value="Soprano">Soprano</option>
            <option value="Alto">Alto</option>
            <option value="Ténor">Ténor</option>
            <option value="Basse">Basse</option>
            <option value="Chœur">Tout le chœur</option>
          </select>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500">Fichier PDF / Image</label>
            <input type="file" onChange={handleFileUpload} disabled={uploading} className="text-sm" />
          </div>
        </div>
        <button type="submit" disabled={loading || uploading} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 transition">
          {loading ? 'Enregistrement...' : 'Ajouter la partition'}
        </button>
      </form>

      {/* Liste des partitions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {partitions.map((part) => (
          <div key={part.id} className="bg-white p-4 rounded shadow border-l-4 border-blue-500 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg">{part.titre}</h3>
              <p className="text-sm text-gray-500 mb-4">{part.compositeur} — <span className="text-blue-600 font-semibold">{part.voix}</span></p>
            </div>
            
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
              <a 
                href={part.fichier_url} 
                target="_blank" 
                rel="noreferrer" 
                className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm font-bold hover:bg-blue-100"
              >
                👁️ Voir
              </a>
              
              <button 
                onClick={() => handleDelete(part.id, part.fichier_url)}
                className="text-red-400 hover:text-red-600 p-1 transition"
                title="Supprimer"
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        ))}
        {partitions.length === 0 && <p className="text-gray-400">Aucune partition disponible.</p>}
      </div>
    </div>
  );
};

export default Partitions;