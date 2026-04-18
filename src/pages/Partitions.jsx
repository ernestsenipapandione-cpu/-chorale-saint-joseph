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
    if (url.includes('.pdf')) return '📄'
    if (url.includes('.mp3') || url.includes('.wav') || url.includes('.mpeg')) return '🎵'
    if (url.includes('.jpg') || url.includes('.png') || url.includes('.jpeg')) return '🖼️'
    return '📁'
  }

  return (
    <Layout>
      <Toaster />
      <div className="p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-primary">🎵 Partitions</h2>
            <p className="text-gray-500">Bibliothèque de partitions de la chorale</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition duration-300"
          >
            {showForm ? '✕ Fermer' : '+ Ajouter une partition'}
          </button>
        </div>

        {/* Formulaire */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h3 className="text-xl font-bold text-primary mb-4">Nouvelle partition</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  value={form.titre}
                  onChange={(e) => setForm({ ...form, titre: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Compositeur</label>
                <input
                  type="text"
                  value={form.compositeur}
                  onChange={(e) => setForm({ ...form, compositeur: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Voix</label>
                <select
                  value={form.voix}
                  onChange={(e) => setForm({ ...form, voix: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Toutes les voix</option>
                  <option value="Soprano">Soprano</option>
                  <option value="Alto">Alto</option>
                  <option value="Ténor">Ténor</option>
                  <option value="Basse">Basse</option>
                </select>
              </div>

              {/* Upload fichier */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Uploader un fichier (PDF, MP3, Image)
                </label>
                <input
                  type="file"
                  accept=".pdf,.mp3,.wav,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {uploading && (
                  <p className="text-sm text-primary mt-1">⏳ Upload en cours...</p>
                )}
                {form.fichier_url && (
                  <p className="text-sm text-green-600 mt-1">✅ Fichier uploadé !</p>
                )}
              </div>

              {/* Ou lien URL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ou entrer un lien URL
                </label>
                <input
                  type="text"
                  value={form.fichier_url}
                  onChange={(e) => setForm({ ...form, fichier_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition duration-300 disabled:opacity-50"
                >
                  Ajouter la partition
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des partitions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-gray-500">Chargement...</p>
          ) : partitions.length === 0 ? (
            <p className="text-gray-500">Aucune partition pour le moment</p>
          ) : (
            partitions.map((partition) => (
              <div key={partition.id} className="bg-white rounded-2xl shadow p-6">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-3xl">{getFileIcon(partition.fichier_url)}</span>
                  {partition.voix && (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getVoixColor(partition.voix)}`}>
                      {partition.voix}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-primary mb-1">{partition.titre}</h3>
                {partition.compositeur && (
                  <p className="text-gray-500 text-sm mb-3">🎼 {partition.compositeur}</p>
                )}
                <div className="flex gap-2 mt-4">
                  {partition.fichier_url && (
                    <>
                      <a
                        href={partition.fichier_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-primary text-white py-2 rounded-xl text-sm font-semibold text-center hover:bg-blue-800 transition"
                      >
                        👁️ Voir
                      </a>
                      <a
                        href={partition.fichier_url}
                        download
                        className="flex-1 bg-secondary text-white py-2 rounded-xl text-sm font-semibold text-center hover:bg-yellow-500 transition"
                      >
                        ⬇️ Télécharger
                      </a>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(partition.id)}
                    className="bg-red-100 text-red-500 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-red-200 transition"
                  >
                    🗑️
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