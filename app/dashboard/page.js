'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Dashboard() {
  const { user, supabase, loading } = useAuth()
  const router = useRouter()
  const [obras, setObras] = useState([])
  const [perfil, setPerfil] = useState(null)

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.push('/login')
      return
    }
    async function cargar() {
      const { data: obrasData } = await supabase
        .from('obras')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setObras(obrasData || [])

      const { data: perfilData } = await supabase
        .from('users')
        .select('nombre, plan')
        .eq('id', user.id)
        .single()
      setPerfil(perfilData)
    }
    cargar()
  }, [user, loading])

  if (loading || !perfil) return <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center"><p className="text-[#0f3d52] font-bold">Cargando...</p></div>

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <aside className="fixed top-0 left-0 h-full w-64 bg-[#0f3d52] flex flex-col z-50">
        <div className="px-6 py-8 border-b border-white/10">
          <span className="font-black text-white text-xl tracking-tight">ObraQR</span>
          <p className="text-white/40 text-xs mt-1">{perfil?.nombre || user.email}</p>
          <span className="inline-block mt-2 px-2 py-0.5 bg-[#F5B800] text-[#0f3d52] text-xs font-bold rounded uppercase tracking-wide">{perfil?.plan || 'gratis'}</span>
        </div>
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/10 text-white text-sm font-medium">
            📋 Mis obras
          </Link>
          <Link href="/dashboard/clientes" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-white text-sm font-medium transition-all">
            👥 Clientes
          </Link>
          <Link href="/dashboard/cuenta" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-white text-sm font-medium transition-all">
            ⚙️ Cuenta
          </Link>
          {perfil?.plan === 'business' && (
            <Link href="/dashboard/equipo" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-white text-sm font-medium transition-all">
              🏢 Equipo
            </Link>
          )}
        </nav>
        <div className="px-4 py-6 border-t border-white/10">
          <Link href="/dashboard/nueva-obra" className="block w-full text-center py-3 bg-[#F5B800] text-[#0f3d52] font-bold text-sm rounded-lg hover:bg-[#d9a200] transition-all">
            + Nueva obra
          </Link>
        </div>
      </aside>

      <main className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="font-black text-3xl text-[#0f3d52] tracking-tight">Mis obras</h1>
            <p className="text-[#555] mt-1">{obras.length} obra{obras.length !== 1 ? 's' : ''} activa{obras.length !== 1 ? 's' : ''}</p>
          </div>

          {obras.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#e8e8e8]">
              <p className="text-4xl mb-4">🏗️</p>
              <h2 className="font-black text-xl text-[#0f3d52] mb-2">No tienes obras todavía</h2>
              <p className="text-[#555] mb-6">Crea tu primera obra en menos de 30 segundos.</p>
              <Link href="/dashboard/nueva-obra" className="inline-block px-6 py-3 bg-[#0f3d52] text-white font-bold rounded-lg hover:bg-[#1a5c78] transition-all">
                Crear primera obra
              </Link>
            </div>
          )}

          <div className="grid gap-4">
            {obras.map(obra => (
              <Link key={obra.id} href={`/dashboard/obra/${obra.id}`}>
                <div className="bg-white rounded-2xl p-6 border border-[#e8e8e8] hover:border-[#0f3d52] hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-black text-lg text-[#0f3d52] mb-1">{obra.nombre}</h2>
                      <p className="text-[#555] text-sm">{obra.direccion}</p>
                      {obra.cliente_nombre && (
                        <p className="text-[#555] text-sm mt-1">👤 {obra.cliente_nombre}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${obra.estado === 'en_curso' ? 'bg-[#4CAF50]/10 text-[#388e3c]' : 'bg-gray-100 text-gray-500'}`}>
                        {obra.estado === 'en_curso' ? 'En curso' : obra.estado}
                      </span>
                      <span className="text-xs text-[#555]">{new Date(obra.created_at).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}