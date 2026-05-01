'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DashboardHeader from '@/app/components/DashboardHeader'

export default function Dashboard() {
  const { user, supabase, loading } = useAuth()
  const router = useRouter()
  const [obras, setObras] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [updateCounts, setUpdateCounts] = useState({})

  useEffect(() => {
    if (loading) return
    if (!user) { router.push('/login'); return }
    async function cargar() {
      const { data: obrasData } = await supabase.from('obras').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      setObras(obrasData || [])
      if (obrasData?.length > 0) {
        const { data: updatesData } = await supabase.from('updates').select('obra_id, created_at').in('obra_id', obrasData.map(o => o.id)).order('created_at', { ascending: false })
        const counts = {}
        updatesData?.forEach(u => {
          if (!counts[u.obra_id]) counts[u.obra_id] = { count: 0, last: u.created_at }
          counts[u.obra_id].count++
        })
        setUpdateCounts(counts)
      }
    }
    cargar()
  }, [user, loading])

  const obrasFiltradas = obras.filter(o =>
    o.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (o.cliente_nombre && o.cliente_nombre.toLowerCase().includes(busqueda.toLowerCase()))
  )

  const enCurso = obras.filter(o => o.estado === 'en_curso').length
  const pausadas = obras.filter(o => o.estado === 'pausada').length
  const terminadas = obras.filter(o => o.estado === 'terminada').length

  const estadoConfig = {
    en_curso: { label: 'En curso', bg: 'bg-[#4CAF50]/10', text: 'text-[#388e3c]' },
    pausada: { label: 'Pausada', bg: 'bg-yellow-100', text: 'text-yellow-700' },
    terminada: { label: 'Terminada', bg: 'bg-gray-100', text: 'text-gray-500' },
  }

  if (loading) return <div className="min-h-screen bg-[#F5B800] flex items-center justify-center"><p className="text-[#0f3d52] font-bold">Cargando...</p></div>

  return (
    <div className="min-h-screen bg-[#F5B800]">
      <DashboardHeader accionDerecha={
        <Link href="/dashboard/nueva-obra" className="px-5 py-2.5 bg-[#4CAF50] text-white font-bold text-sm uppercase tracking-wider rounded hover:bg-[#388e3c] transition-all">
          + Nueva obra
        </Link>
      } />

      <main className="pt-[72px] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-4 gap-4 mb-8 pt-4">
            <div className="bg-[#0f3d52] rounded-2xl p-6">
              <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Total</p>
              <p className="text-white font-black text-4xl">{obras.length}</p>
            </div>
            <div className="bg-[#0f3d52] rounded-2xl p-6">
              <p className="text-white/50 text-xs uppercase tracking-widest mb-1">En curso</p>
              <p className="text-[#4CAF50] font-black text-4xl">{enCurso}</p>
            </div>
            <div className="bg-[#0f3d52] rounded-2xl p-6">
              <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Pausadas</p>
              <p className="text-[#F5B800] font-black text-4xl">{pausadas}</p>
            </div>
            <div className="bg-[#0f3d52] rounded-2xl p-6">
              <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Terminadas</p>
              <p className="text-white font-black text-4xl">{terminadas}</p>
            </div>
          </div>

          <div className="mb-6">
            <input type="text" placeholder="Buscar obra o cliente..." value={busqueda} onChange={e => setBusqueda(e.target.value)} className="w-full px-5 py-3.5 rounded-xl bg-white border-2 border-transparent focus:border-[#0f3d52] outline-none text-[#0f3d52] font-medium placeholder:text-gray-400" />
          </div>

          {obras.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#e8e8e8]">
              <p className="text-4xl mb-4">🏗️</p>
              <h2 className="font-black text-xl text-[#0f3d52] mb-2">No tienes obras todavía</h2>
              <p className="text-[#555] mb-6">Crea tu primera obra en menos de 30 segundos.</p>
              <Link href="/dashboard/nueva-obra" className="inline-block px-6 py-3 bg-[#0f3d52] text-white font-bold rounded-lg hover:bg-[#1a5c78] transition-all">Crear primera obra</Link>
            </div>
          )}

          <div className="grid gap-4">
            {obrasFiltradas.map(obra => {
              const estado = estadoConfig[obra.estado] || estadoConfig.en_curso
              return (
                <Link key={obra.id} href={`/dashboard/obra/${obra.id}`}>
                  <div className="bg-white rounded-2xl p-6 border-2 border-transparent hover:border-[#0f3d52] hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="font-black text-lg text-[#0f3d52] mb-1">{obra.nombre}</h2>
                        <p className="text-[#555] text-sm">{obra.direccion}</p>
                        {obra.cliente_nombre && <p className="text-[#555] text-sm mt-1">👤 {obra.cliente_nombre}</p>}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${estado.bg} ${estado.text}`}>{estado.label}</span>
                        <span className="text-xs text-[#555]">{new Date(obra.created_at).toLocaleDateString('es-ES')}</span>
                        {updateCounts[obra.id] && <span className="text-xs text-[#0f3d52] font-semibold">{updateCounts[obra.id].count} actualización{updateCounts[obra.id].count !== 1 ? 'es' : ''}</span>}
                        {updateCounts[obra.id] && <span className="text-xs text-[#555]">Última: {new Date(updateCounts[obra.id].last).toLocaleDateString('es-ES')}</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}