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
  const [fases, setFases] = useState([])
  const [loading, setLoading] = useState(true)
  const [popupImg, setPopupImg] = useState(null)
  const [cambiandoEstado, setCambiandoEstado] = useState(false)
  const [nuevaFase, setNuevaFase] = useState('')
  const [guardandoConfig, setGuardandoConfig] = useState(false)
  const [config, setConfig] = useState({ porcentaje_avance: 0, fecha_fin_estimada: '', telefono_constructor: '', whatsapp_constructor: '' })

  useEffect(() => {
    if (!user) return
    async function cargar() {
      const { data: obraData } = await supabase.from('obras').select('*').eq('id', id).single()
      if (!obraData) { router.push('/dashboard'); return }
      setObra(obraData)
      setConfig({
        porcentaje_avance: obraData.porcentaje_avance || 0,
        fecha_fin_estimada: obraData.fecha_fin_estimada || '',
        telefono_constructor: obraData.telefono_constructor || '',
        whatsapp_constructor: obraData.whatsapp_constructor || ''
      })
      const { data: updatesData } = await supabase.from('updates').select('*, update_images(*), users(nombre)').eq('obra_id', id).order('created_at', { ascending: false })
      setUpdates(updatesData || [])
      const { data: fasesData } = await supabase.from('fases_obra').select('*').eq('obra_id', id).order('orden')
      setFases(fasesData || [])
      setLoading(false)
    }
    cargar()
  }, [user, id])

  async function cambiarEstado(nuevoEstado) {
    setCambiandoEstado(true)
    await supabase.from('obras').update({ estado: nuevoEstado }).eq('id', id)
    setObra({ ...obra, estado: nuevoEstado })
    setCambiandoEstado(false)
  }

  async function guardarConfig() {
    setGuardandoConfig(true)
    await supabase.from('obras').update(config).eq('id', id)
    setObra({ ...obra, ...config })
    setGuardandoConfig(false)
  }

  async function añadirFase() {
    if (!nuevaFase.trim()) return
    const { data } = await supabase.from('fases_obra').insert({ obra_id: id, nombre: nuevaFase, estado: 'pendiente', orden: fases.length }).select().single()
    if (data) { setFases([...fases, data]); setNuevaFase('') }
  }

  async function cambiarEstadoFase(faseId, nuevoEstado) {
    await supabase.from('fases_obra').update({ estado: nuevoEstado }).eq('id', faseId)
    setFases(fases.map(f => f.id === faseId ? { ...f, estado: nuevoEstado } : f))
  }

  async function eliminarFase(faseId) {
    await supabase.from('fases_obra').delete().eq('id', faseId)
    setFases(fases.filter(f => f.id !== faseId))
  }

  const estadoConfig = {
    en_curso: { label: 'En curso', bg: 'bg-[#4CAF50]/20', text: 'text-[#4CAF50]' },
    pausada: { label: 'Pausada', bg: 'bg-yellow-100', text: 'text-yellow-700' },
    terminada: { label: 'Terminada', bg: 'bg-gray-100', text: 'text-gray-400' },
  }

  const fasesEstado = {
    pendiente: { label: 'Pendiente', bg: 'bg-gray-100', text: 'text-gray-500' },
    en_curso: { label: 'En curso', bg: 'bg-[#4CAF50]/10', text: 'text-[#388e3c]' },
    completada: { label: 'Completada', bg: 'bg-[#0f3d52]/10', text: 'text-[#0f3d52]' },
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
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${estado.bg} ${estado.text}`}>{estado.label}</span>
                <a href={`https://obraqr.vercel.app/qr/${obra.slug}`} target="_blank" className="text-[#F5B800] text-xs font-semibold hover:underline">Ver página cliente →</a>
                <Link href={`/dashboard/qr/${id}`} className="text-white/60 text-xs hover:text-white transition-colors">Ver QR</Link>
                <div className="flex gap-2 mt-2">
                  {obra.estado !== 'en_curso' && <button onClick={() => cambiarEstado('en_curso')} disabled={cambiandoEstado} className="px-3 py-1 bg-[#4CAF50]/20 text-[#4CAF50] text-xs font-bold rounded-full hover:bg-[#4CAF50]/40 transition-all">Reanudar</button>}
                  {obra.estado !== 'pausada' && <button onClick={() => cambiarEstado('pausada')} disabled={cambiandoEstado} className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full hover:bg-yellow-200 transition-all">Pausar</button>}
                  {obra.estado !== 'terminada' && <button onClick={() => cambiarEstado('terminada')} disabled={cambiandoEstado} className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-full hover:bg-gray-200 transition-all">Finalizar</button>}
                </div>
              </div>
            </div>
          </div>

          {/* CONFIGURACION */}
          <div className="bg-white rounded-2xl p-6 mb-6 border border-[#e8e8e8]">
            <h2 className="font-black text-lg text-[#0f3d52] mb-5">Configuración de obra</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-[#555] uppercase tracking-wide mb-2">Progreso ({config.porcentaje_avance}%)</label>
                <input type="range" min="0" max="100" value={config.porcentaje_avance} onChange={e => setConfig({ ...config, porcentaje_avance: parseInt(e.target.value) })} className="w-full accent-[#0f3d52]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#555] uppercase tracking-wide mb-2">Fecha fin estimada</label>
                <input type="date" value={config.fecha_fin_estimada} onChange={e => setConfig({ ...config, fecha_fin_estimada: e.target.value })} className="w-full px-3 py-2 rounded-lg border-2 border-[#e8e8e8] focus:border-[#0f3d52] outline-none text-sm text-[#0f3d52]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#555] uppercase tracking-wide mb-2">Teléfono</label>
                <input type="text" placeholder="+34 600 000 000" value={config.telefono_constructor} onChange={e => setConfig({ ...config, telefono_constructor: e.target.value })} className="w-full px-3 py-2 rounded-lg border-2 border-[#e8e8e8] focus:border-[#0f3d52] outline-none text-sm text-[#0f3d52]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#555] uppercase tracking-wide mb-2">WhatsApp</label>
                <input type="text" placeholder="+34 600 000 000" value={config.whatsapp_constructor} onChange={e => setConfig({ ...config, whatsapp_constructor: e.target.value })} className="w-full px-3 py-2 rounded-lg border-2 border-[#e8e8e8] focus:border-[#0f3d52] outline-none text-sm text-[#0f3d52]" />
              </div>
            </div>
            <button onClick={guardarConfig} disabled={guardandoConfig} className="px-6 py-2.5 bg-[#0f3d52] text-white font-bold text-sm rounded-xl hover:bg-[#1a5c78] transition-all disabled:opacity-50">
              {guardandoConfig ? 'Guardando...' : 'Guardar configuración'}
            </button>
          </div>

          {/* FASES */}
          <div className="bg-white rounded-2xl p-6 mb-6 border border-[#e8e8e8]">
            <h2 className="font-black text-lg text-[#0f3d52] mb-5">Fases de la obra</h2>
            <div className="flex gap-3 mb-4">
              <input type="text" placeholder="Ej: Demolición, Fontanería, Pintura..." value={nuevaFase} onChange={e => setNuevaFase(e.target.value)} onKeyDown={e => e.key === 'Enter' && añadirFase()} className="flex-1 px-3 py-2 rounded-lg border-2 border-[#e8e8e8] focus:border-[#0f3d52] outline-none text-sm text-[#0f3d52]" />
              <button onClick={añadirFase} className="px-4 py-2 bg-[#0f3d52] text-white font-bold text-sm rounded-lg hover:bg-[#1a5c78] transition-all">Añadir</button>
            </div>
            {fases.length === 0 && <p className="text-[#555] text-sm">No hay fases todavía.</p>}
            <div className="flex flex-col gap-2">
              {fases.map(fase => {
                const fe = fasesEstado[fase.estado] || fasesEstado.pendiente
                return (
                  <div key={fase.id} className="flex items-center justify-between p-3 rounded-xl bg-[#f5f0e8]">
                    <span className="text-[#0f3d52] font-medium text-sm">{fase.nombre}</span>
                    <div className="flex items-center gap-2">
                      <select value={fase.estado} onChange={e => cambiarEstadoFase(fase.id, e.target.value)} className={`text-xs font-bold px-2 py-1 rounded-full border-0 outline-none cursor-pointer ${fe.bg} ${fe.text}`}>
                        <option value="pendiente">Pendiente</option>
                        <option value="en_curso">En curso</option>
                        <option value="completada">Completada</option>
                      </select>
                      <button onClick={() => eliminarFase(fase.id)} className="text-red-400 hover:text-red-600 text-xs font-bold transition-colors">✕</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* TIMELINE */}
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