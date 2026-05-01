'use client'

import { useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import DashboardHeader from '@/app/components/DashboardHeader'

export default function NuevaActualizacion() {
  const { user, supabase } = useAuth()
  const router = useRouter()
  const { id } = useParams()
  const [texto, setTexto] = useState('')
  const [fotos, setFotos] = useState([])
  const [previews, setPreviews] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleFotos(e) {
    const files = Array.from(e.target.files)
    setFotos(files)
    setPreviews(files.map(f => URL.createObjectURL(f)))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (!user) { router.push('/login'); return }
    const { data: updateData, error: updateError } = await supabase.from('updates').insert({ obra_id: id, user_id: user.id, texto }).select().single()
    if (updateError) { setError(updateError.message); setLoading(false); return }
    for (let i = 0; i < fotos.length; i++) {
      const foto = fotos[i]
      const fileName = `${id}/${updateData.id}/${Date.now()}-${foto.name}`
      const { error: uploadError } = await supabase.storage.from('obras').upload(fileName, foto)
      if (uploadError) { setError(uploadError.message); setLoading(false); return }
      const { data: urlData } = supabase.storage.from('obras').getPublicUrl(fileName)
      await supabase.from('update_images').insert({ update_id: updateData.id, storage_url: urlData.publicUrl, orden: i })
    }
    router.push(`/dashboard/obra/${id}`)
  }

  return (
    <div className="min-h-screen bg-[#F5B800]">
      <DashboardHeader />
      <main className="pt-[72px] p-8">
        <div className="max-w-2xl mx-auto">
          <div className="pt-4 mb-6">
            <Link href={`/dashboard/obra/${id}`} className="text-[#0f3d52] font-semibold text-sm hover:underline">← Volver a la obra</Link>
          </div>
          <div className="bg-white rounded-2xl p-8 border border-[#e8e8e8]">
            <h1 className="font-black text-2xl text-[#0f3d52] mb-6">Nueva actualización</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <textarea placeholder="¿Qué se ha hecho hoy?" value={texto} onChange={e => setTexto(e.target.value)} required rows={4} className="w-full px-4 py-3 rounded-xl border-2 border-[#e8e8e8] focus:border-[#0f3d52] outline-none text-[#0f3d52] font-medium placeholder:text-gray-400 resize-none" />
              <div>
                <label className="block text-sm font-semibold text-[#0f3d52] mb-2">Fotos</label>
                <label className="flex items-center justify-center gap-3 w-full py-4 border-2 border-dashed border-[#0f3d52]/30 rounded-xl cursor-pointer hover:border-[#0f3d52] transition-colors bg-[#f5f0e8]">
                  <span className="text-[#0f3d52] font-medium text-sm">Seleccionar fotos</span>
                  <input type="file" accept="image/*" multiple onChange={handleFotos} className="hidden" />
                </label>
              </div>
              {previews.length > 0 && (
                <div className="flex gap-3 flex-wrap">
                  {previews.map((src, i) => <img key={i} src={src} alt="" className="w-24 h-24 object-cover rounded-xl" />)}
                </div>
              )}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" disabled={loading} className="w-full py-4 bg-[#0f3d52] text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-[#1a5c78] transition-all disabled:opacity-50">
                {loading ? 'Publicando...' : 'Publicar actualización'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}