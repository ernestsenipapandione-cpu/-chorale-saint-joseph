import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase/client'
import Layout from '../components/Layout'
import toast, { Toaster } from 'react-hot-toast'

const Partitions = () => {
  const [partitions, setPartitions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    titre: '',
    compositeur: '',
    voix: '',
    fichier_url: '',
  })

  useEffect(() => {
    fetchPartitions()
  }, [])

  const fetchPartitions = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('partitions')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      toast.error('Erreur lors du chargement des partitions')
    } else {
      setPartitions(data)
    }
    setLoading(false)
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    const fileName = `${Date.now()}_${file.name}`

    const { data, error } = await supabase.storage
      .from('partitions')
      .upload(fileName, file)

    if (error) {
      toast.error('Erreur lors de l\'upload : ' + error.message)
    } else {
      const { data: urlData } = supabase.storage
        .from('partitions')
        .getPublicUrl(fileName)
      setForm({ ...form, fichier_url: urlData.publicUrl })
      toast.success('Fichier uploadé avec succès !')
    }
    setUploading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.fichier_url) {
        toast.error('Veuillez uploader un fichier ou entrer un lien');
        return;
    }
    const { error } = await supabase
      .from('partitions')
      .insert([form])
    if (error) {
      toast.error('Erreur lors de l\'ajout de la partition')
    } else {
      toast.success('Partition ajoutée avec succès !')
      setShowForm(false)
      setForm({
        titre: '',
        compositeur: '',
        voix: '',
        fichier_url: '',
      })
      fetchPartitions()
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cette partition ?")) {
        const { error } = await supabase
          .from('partitions')
          .delete()
          .eq('id', id)
        if (error) {
          toast.error('Erreur lors de la suppression')
        } else {
          toast.success('Partition supprimée !')
          fetchPartitions()
        }
    }
  }

  const getVoixColor = (voix) => {
    switch (voix) {
      case 'Soprano': return 'bg-pink-100 text-pink-600'
      case 'Alto': return 'bg-purple-100 text-purple-600'
      case 'Ténor': return 'bg-blue-100 text-blue-600'
      case 'Basse': return 'bg-green-100 text-green-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getFileIcon = (url) => {
    if (!url) return '📄'
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('.pdf')) return '📕'
    if (lowerUrl.includes('.mp3') || lowerUrl.includes('.wav') || lowerUrl.includes('.mpeg')) return '🎶'
    if (lowerUrl.includes('.jpg') || lowerUrl.includes('.png') || lowerUrl.includes('.jpeg')) return '🖼️'
    return '📁'
  }

  return (
    <Layout>
      <Toaster />
      <div className="p-4 md:p-6">

        {/* Header Responsive */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-primary">🎵 Partitions</h2>
            <p className="text-sm text-gray-500">Bibliothèque de la chorale</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full md:w-auto bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition"
          >
            {showForm ? '✕ Fermer' : '+ Ajouter une partition'}
          </button>
        </div>

        {/* Formulaire Responsive */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-6 border border-gray-100">
            <h3 className="text-lg font-bold text-primary mb-4">Nouvelle partition</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Titre de l'œuvre</label>
                <input
                  type="text"
                  value={form.titre}
                  onChange={(e) => setForm({ ...form, titre: e.target.value })}
                  required
                  placeholder="Ex: Ave Maria"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Compositeur</label>
                <input
                  type="text"
                  value={form.compositeur}
                  onChange={(e) => setForm({ ...form, compositeur: e.target.value })}
                  placeholder="Ex: Gounod / Bach"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Voix concernée</label>
                <select
                  value={form.voix}
                  onChange={(e) => setForm({ ...form, voix: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none text-sm"
                >
                  <option value="">Toutes les voix</option>
                  <option value="Soprano">Soprano</option>
                  <option value="Alto">Alto</option>
                  <option value="Ténor">Ténor</option>
                  <option value="Basse">Basse</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Fichier (PDF, Audio, Image)</label>
                <input
                  type="file"
                  accept=".pdf,.mp3,.wav,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100"
                />
                {uploading && <p className="text-xs text-primary mt-1 animate-pulse font-bold">⏳ Upload en cours...</p>}
                {form.fichier_url && !uploading && <p className="text-xs text-green-600 mt-1 font-bold">✅ Fichier prêt</p>}
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition disabled:opacity-50"
                >
                  Enregistrer la partition
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des partitions en Cartes (Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <p className="text-center col-span-full py-10 text-gray-400">Chargement de la bibliothèque...</p>
          ) : partitions.length === 0 ? (
            <p className="text-center col-span-full py-10 text-gray-400">Aucune partition disponible.</p>
          ) : (
            partitions.map((partition) => (
              <div key={partition.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-4xl bg-gray-50 w-12 h-12 flex items-center justify-center rounded-xl">
                      {getFileIcon(partition.fichier_url)}
                    </span>
                    {partition.voix && (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getVoixColor(partition.voix)}`}>
                        {partition.voix}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 leading-tight mb-1">{partition.titre}</h3>
                  <p className="text-sm text-gray-500 mb-4 italic">
                    {partition.compositeur ? `🎼 ${partition.compositeur}` : '🎼 Compositeur inconnu'}
                  </p>
                </div>

                <div className="space-y-2">
                  {partition.fichier_url ? (
                    <div className="flex gap-2">
                      <a
                        href={partition.fichier_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-primary/10 text-primary py-2.5 rounded-xl text-xs font-bold text-center hover:bg-primary hover:text-white transition"
                      >
                        Ouvrir
                      </a>
                      <a
                        href={partition.fichier_url}
                        download
                        className="flex-1 bg-secondary text-white py-2.5 rounded-xl text-xs font-bold text-center hover:bg-yellow-500 transition"
                      >
                        Télécharger
                      </a>
                    </div>
                  ) : (
                    <p className="text-xs text-red-400 text-center italic">Lien manquant</p>
                  )}
                  
                  <button
                    onClick={() => handleDelete(partition.id)}
                    className="w-full py-2 text-xs font-bold text-gray-400 hover:text-red-500 transition border-t border-gray-50 mt-2"
                  >
                    🗑️ Supprimer de la liste
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Partitions