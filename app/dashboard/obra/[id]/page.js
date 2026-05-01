'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import DashboardHeader from '@/app/components/DashboardHeader'

export default function DetalleObra() {
  const { user, supabase } = useAuth()
  const router = useRouter()
  const { id } = useParams()
  const [obra, setObra] = useState(null)
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState(true)
  const [popupImg, setPopupImg] = useState(null)

  useEffect(() => {
    if (!user) return
    async function cargarObra() {
      const { data: obraData } = await supabase
        .from('obras').select('*').eq('id', id).single()
      if (!obraData) { router.push('/dashboard'); return }
      setObra(obraData)
      const { data: updatesData } = await supabase
        .from('updates').select('*, update_images(*), users(nombre)')
        .eq('obra_id', id).order('created_at', { ascending: false })
      setUpdates(updatesData || [])
      setLoading(false)
    }
    cargarObra()
  }, [user, id])

  if (loading) return (
    <div className="min-h-screen bg-[#F5B800] flex items-center justify-center">
      <p className="text-[#0f3d52] font-bold">Cargando...</p>
    </div>
  )
  if (!obra) return null

  const Popup = popupImg && (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4" onClick={() => setPopupImg(null)}>
      <img src={popupImg} alt="" className="max-w-full max-h-full rounded-xl object-contain" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F5B800]">
        {/* MAIN */}
      {Popup}
      <DashboardHeader />

      {/* MAIN */}
      <main className="pt-[72px] p-8">
        <div className="max-w-4xl mx-auto">

          {/* BACK */}
          <div className="pt-4 mb-6">
            <Link href="/dashboard" className="text-[#0f3d52] font-semibold text-sm hover:underline">← Mis obras</Link>
          </div>

          {/* INFO OBRA */}
          <div className="bg-[#0f3d52] rounded-2xl p-6 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-black text-2xl text-white mb-1">{obra.nombre}</h1>
                <p className="text-white/60 text-sm">{obra.direccion}</p>
                {obra.cliente_nombre && <p className="text-white/60 text-sm mt-1">Cliente: {obra.cliente_nombre}</p>}
                {obra.fecha_inicio && <p className="text-white/60 text-sm mt-1">Inicio: {new Date(obra.fecha_inicio).toLocaleDateString('es-ES')}</p>}
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#4CAF50]/20 text-[#4CAF50]">
                  {obra.estado === 'en_curso' ? 'En curso' : obra.estado}
                </span>
                <a href={`https://obraqr.vercel.app/qr/${obra.slug}`} target="_blank" className="text-[#F5B800] text-xs font-semibold hover:underline">
                  Ver página cliente →
                </a>
                <Link href={`/dashboard/qr/${id}`} className="text-white/60 text-xs hover:text-white transition-colors">
                  Ver QR
                </Link>
              </div>
            </div>
          </div>

          {/* TIMELINE */}
          <h2 className="font-black text-xl text-[#0f3d52] mb-4">Actualizaciones</h2>

          {updates.length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center border border-[#e8e8e8]">
              <p className="text-[#555]">No hay actualizaciones todavía.</p>
              <Link href={`/dashboard/obra/${id}/nueva-actualizacion`} className="inline-block mt-4 px-5 py-2.5 bg-[#0f3d52] text-white font-bold text-sm rounded-lg hover:bg-[#1a5c78] transition-all">
                Subir primera actualización
              </Link>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {updates.map(update => (
              <div key={update.id} className="bg-white rounded-2xl p-6 border border-[#e8e8e8]">
                <div className="flex items-center gap-3 mb-3">
                  <p className="text-xs text-[#555] font-semibold">{new Date(update.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  {update.users?.nombre && <span className="text-xs text-[#0f3d52] font-bold">· {update.users.nombre}</span>}
                </div>
                <div className="flex gap-4 items-start">
                  {update.update_images?.length > 0 && (
                    <div className="flex gap-2 flex-shrink-0">
                      {update.update_images.map(img => (
                        <img
                          key={img.id}
                          src={img.storage_url}
                          alt=""
                          className="w-28 h-28 object-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setPopupImg(img.storage_url)}
                        />
                      ))}
                    </div>
                  )}
                  <p className="text-[#0f3d52] font-medium">{update.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}