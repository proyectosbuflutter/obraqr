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

  if (loading || !perfil) return (
    <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
      <p className="text-[#0f3d52] font-bold">Cargando...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F5B800]">

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 h-[72px] bg-[#0f3d52] flex items-center justify-between px-8 z-50">
        <Link href="/dashboard">
          <img src="/obraqr.png" alt="ObraQR" className="h-12 w-auto" />
        </Link>
        <nav className="flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link href="/dashboard" className="text-white text-xs font-semibold uppercase tracking-widest hover:text-[#F5B800] transition-colors">Mis obras</Link>
          <Link href="/dashboard/clientes" className="text-white/60 text-xs font-semibold uppercase tracking-widest hover:text-[#F5B800] transition-colors">Clientes</Link>
          <Link href="/dashboard/cuenta" className="text-white/60 text-xs font-semibold uppercase tracking-widest hover:text-[#F5B800] transition-colors">Cuenta</Link>
          {perfil?.plan === 'business' && (
            <Link href="/dashboard/equipo" className="text-white/60 text-xs font-semibold uppercase tracking-widest hover:text-[#F5B800] transition-colors">Equipo</Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 bg-[#F5B800] text-[#0f3d52] text-sm font-bold rounded uppercase tracking-wide">{perfil?.plan || 'gratis'}</span>
          <Link href="/dashboard/cuenta" className="px-4 py-2 border-2 border-white/40 text-white text-sm font-bold rounded uppercase tracking-wide hover:border-white transition-all">
            Mejora tu plan
          </Link>
          <Link href="/dashboard/nueva-obra" className="px-5 py-2.5 bg-[#4CAF50] text-white font-bold text-sm uppercase tracking-wider rounded hover:bg-[#388e3c] transition-all">
            + Nueva obra
          </Link>
        </div>
      </header>

      {/* MAIN */}
      <main className="pt-[72px] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 pt-4">
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