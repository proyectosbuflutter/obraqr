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
  const [cambiandoEstado, setCambiandoEstado] = useState(false)

  useEffect(() => {
    if (!user) return
    async function cargarObra() {
      const { data: obraData } = await supabase.from('obras').select('*').eq('id', id).single()
      if (!obraData) { router.push('/dashboard'); return }
      setObra(obraData)
      const { data: updatesData } = await supabase.from('updates').select('*, update_images(*), users(nombre)').eq('obra_id', id).order('created_at', { ascending: false })
      setUpdates(updatesData || [])
      setLoading(false)
    }
    cargarObra()
  }, [user, id])

  async function cambiarEstado(nuevoEstado) {
    setCambiandoEstado(true)
    await supabase.from('obras').update({ estado: nuevoEstado }).eq('id', id)
    setObra({ ...obra, estado: nuevoEstado })
    setCambiandoEstado(false)
  }

  const estadoConfig = {
    en_curso: { label: 'En curso', bg: 'bg-[#4CAF50]/20', text: 'text-[#4CAF50]' },
    pausada: { label: 'Pausada', bg: 'bg-yellow-100', text: 'text-yellow-700' },
    terminada: { label: 'Terminada', bg: 'bg-gray-100', text: 'text-gray-400' },
  }

  if (loading) return <div className="min-h-screen bg-[#F5B800] flex items-center justify-center"><p className="text-[#0f3d52] font-bold">Cargando...</p></div>
  if (!obra) return null

  const estado = estadoConfig[obra.estado] || estadoConfig.en_curso

  return (
    <div className="min-h-screen bg-[#F5B800]">
      {popupImg && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4" onClick={() => setPopupImg(null)}>
          <img src={popupImg} alt="" className="max-w-full max-h-full rounded-xl object-contain" />
        </div>
      )}

      <DashboardHeader accionDerecha={
        <Link href={`/dashboard/obra/${id}/nueva-actualizacion`} className="px-5 py-2.5 bg-[#4CAF50] text-white font-bold text-sm uppercase tracking-wider rounded hover:bg-[#388e3c] transition-all">
          + Nueva actualización
        </Link>
      } />

      <main className="pt-[72px] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="pt-4 mb-6">
            <Link href="/dashboard" className="text-[#0f3d52] font-semibold text-sm hover:underline">← Mis obras</Link>
          </div>

          <div className="bg-[#0f3d52] rounded-2xl p-6 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-black text-2xl text-white mb-1">{obra.nombre}</h1>
                <p className="text-white/60 text-sm">{obra.direccion}</p>
                {obra.cliente_nombre && <p className="text-white/60 text-sm mt-1">Cliente: {obra.cliente_nombre}</p>}
                {obra.fecha_inicio && <p className="text-white/60 text-sm mt-1">Inicio: {new Date(obra.fecha_inicio).toLocaleDateString('es-ES')}</p>}
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${estado.bg} ${estado.text}`}>{estado.label}</span>
                <a href={`https://obraqr.vercel.app/qr/${obra.slug}`} target="_blank" className="text-[#F5B800] text-xs font-semibold hover:underline">Ver página cliente →</a>
                <Link href={`/dashboard/qr/${id}`} className="text-white/60 text-xs hover:text-white transition-colors">Ver QR</Link>

                <div className="flex gap-2 mt-2">
                  {obra.estado !== 'en_curso' && (
                    <button onClick={() => cambiarEstado('en_curso')} disabled={cambiandoEstado} className="px-3 py-1 bg-[#4CAF50]/20 text-[#4CAF50] text-xs font-bold rounded-full hover:bg-[#4CAF50]/40 transition-all">
                      Reanudar
                    </button>
                  )}
                  {obra.estado !== 'pausada' && (
                    <button onClick={() => cambiarEstado('pausada')} disabled={cambiandoEstado} className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full hover:bg-yellow-200 transition-all">
                      Pausar
                    </button>
                  )}
                  {obra.estado !== 'terminada' && (
                    <button onClick={() => cambiarEstado('terminada')} disabled={cambiandoEstado} className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-full hover:bg-gray-200 transition-all">
                      Finalizar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <h2 className="font-black text-xl text-[#0f3d52] mb-4">Actualizaciones</h2>

          {updates.length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center border border-[#e8e8e8]">
              <p className="text-[#555]">No hay actualizaciones todavía.</p>
              <Link href={`/dashboard/obra/${id}/nueva-actualizacion`} className="inline-block mt-4 px-5 py-2.5 bg-[#0f3d52] text-white font-bold text-sm rounded-lg hover:bg-[#1a5c78] transition-all">Subir primera actualización</Link>
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
                        <img key={img.id} src={img.storage_url} alt="" className="w-28 h-28 object-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setPopupImg(img.storage_url)} />
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