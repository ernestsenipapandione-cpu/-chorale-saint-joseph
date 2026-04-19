import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/client'; // Chemin corrigé
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

      const { error: uploadError } = await supabase.storage
        .from('partitions') // Mis en minuscule pour correspondre à ta base
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
          <input type="file" onChange={handleFileUpload} disabled={uploading} />
        </div>
        <button type="submit" disabled={loading || uploading} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? 'Enregistrement...' : 'Ajouter'}
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {partitions.map((part) => (
          <div key={part.id} className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
            <h3 className="font-bold">{part.titre}</h3>
            <p className="text-sm text-gray-500">{part.compositeur} ({part.voix})</p>
            <a href={part.fichier_url} target="_blank" rel="noreferrer" className="text-blue-600 text-sm mt-2 block">Ouvrir PDF</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Partitions;