'use client'

import { useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function ModalCuenta({ onClose }) {
  const { user, supabase } = useAuth()
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [editando, setEditando] = useState(false)
  const [perfil, setPerfil] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [loading, setLoading] = useState(false)

  useState(() => {
    if (!user) return
    supabase.from('users').select('*').eq('id', user.id).single().then(({ data }) => {
      if (data) { setPerfil(data); setNombre(data.nombre || ''); setEmpresa(data.empresa || '') }
    })
  })

  async function handleGuardar() {
    setLoading(true)
    await supabase.from('users').update({ nombre, empresa }).eq('id', user.id)
    setPerfil({ ...perfil, nombre, empresa })
    setEditando(false)
    setMensaje('Guardado.')
    setLoading(false)
    setTimeout(() => setMensaje(''), 2000)
  }

  async function handleCerrarSesion() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-black text-xl text-[#0f3d52]">Mi cuenta</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-[#f5f0e8] rounded-xl p-4">
            <p className="text-xs text-[#555] font-semibold uppercase tracking-wide mb-1">Email</p>
            <p className="text-[#0f3d52] font-medium">{user?.email}</p>
          </div>

          <div className="bg-[#f5f0e8] rounded-xl p-4">
            <p className="text-xs text-[#555] font-semibold uppercase tracking-wide mb-1">Plan</p>
            <p className="text-[#0f3d52] font-bold uppercase">{perfil?.plan || 'gratis'}</p>
          </div>

          {editando ? (
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#e8e8e8] focus:border-[#0f3d52] outline-none text-[#0f3d52] font-medium"
              />
              <input
                type="text"
                placeholder="Empresa"
                value={empresa}
                onChange={e => setEmpresa(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#e8e8e8] focus:border-[#0f3d52] outline-none text-[#0f3d52] font-medium"
              />
              <div className="flex gap-3">
                <button onClick={handleGuardar} disabled={loading} className="flex-1 py-3 bg-[#0f3d52] text-white font-bold text-sm rounded-xl hover:bg-[#1a5c78] transition-all">
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
                <button onClick={() => setEditando(false)} className="flex-1 py-3 border-2 border-[#e8e8e8] text-[#555] font-bold text-sm rounded-xl hover:border-[#0f3d52] transition-all">
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#f5f0e8] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#555] font-semibold uppercase tracking-wide mb-1">Nombre</p>
                  <p className="text-[#0f3d52] font-medium">{perfil?.nombre || '—'}</p>
                  {perfil?.empresa && <p className="text-[#555] text-sm mt-1">{perfil.empresa}</p>}
                </div>
                <button onClick={() => setEditando(true)} className="text-xs text-[#0f3d52] font-bold hover:underline">Editar</button>
              </div>
            </div>
          )}

          {mensaje && <p className="text-[#4CAF50] text-sm font-semibold text-center">{mensaje}</p>}

          <button
            onClick={handleCerrarSesion}
            className="w-full py-3 border-2 border-red-200 text-red-500 font-bold text-sm rounded-xl hover:bg-red-50 transition-all mt-2"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DashboardHeader() {
  const [modalAbierto, setModalAbierto] = useState(false)

  return (
    <>
      {modalAbierto && <ModalCuenta onClose={() => setModalAbierto(false)} />}
      <header className="fixed top-0 left-0 right-0 h-[72px] bg-[#0f3d52] flex items-center justify-between px-8 z-50">
        <Link href="/dashboard">
          <img src="/obraqr.png" alt="ObraQR" className="h-12 w-auto" />
        </Link>
        <nav className="flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link href="/dashboard" className="text-white/60 text-xs font-semibold uppercase tracking-widest hover:text-[#F5B800] transition-colors">Mis obras</Link>
          <Link href="/dashboard/clientes" className="text-white/60 text-xs font-semibold uppercase tracking-widest hover:text-[#F5B800] transition-colors">Clientes</Link>
          <button
            onClick={() => setModalAbierto(true)}
            className="flex items-center gap-2 text-white/60 text-xs font-semibold uppercase tracking-widest hover:text-[#F5B800] transition-colors"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4CAF50] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4CAF50]"></span>
            </span>
            Mi cuenta
          </button>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/nueva-obra" className="px-5 py-2.5 bg-[#4CAF50] text-white font-bold text-sm uppercase tracking-wider rounded hover:bg-[#388e3c] transition-all">
            + Nueva obra
          </Link>
        </div>
      </header>
    </>
  )
}