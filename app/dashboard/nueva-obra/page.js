'use client'

import { useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function generarSlug(nombre) {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') + '-' + Date.now()
}

export default function NuevaObra() {
  const { user, supabase } = useAuth()
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [direccion, setDireccion] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [clienteNombre, setClienteNombre] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!user) { router.push('/login'); return }

    const slug = generarSlug(nombre)

    const { data, error: dbError } = await supabase
      .from('obras')
      .insert({ user_id: user.id, nombre, direccion, descripcion, slug, estado: 'en_curso', fecha_inicio: fechaInicio || null, cliente_nombre: clienteNombre || null })
      .select().single()

    if (dbError) { setError(dbError.message); setLoading(false); return }

    router.push(`/dashboard/obra/${data.id}`)
  }

  return (
    <div className="min-h-screen bg-[#F5B800]">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 h-[72px] bg-[#0f3d52] flex items-center justify-between px-8 z-50">
        <Link href="/dashboard">
          <img src="/obraqr.png" alt="ObraQR" className="h-12 w-auto" />
        </Link>
        <nav className="flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link href="/dashboard" className="text-white/60 text-xs font-semibold uppercase tracking-widest hover:text-[#F5B800] transition-colors">Mis obras</Link>
          <Link href="/dashboard/clientes" className="text-white/60 text-xs font-semibold uppercase tracking-widest hover:text-[#F5B800] transition-colors">Clientes</Link>
          <Link href="/dashboard/cuenta" className="text-white/60 text-xs font-semibold uppercase tracking-widest hover:text-[#F5B800] transition-colors">Cuenta</Link>
        </nav>
      </header>

      {/* MAIN */}
      <main className="pt-[72px] p-8">
        <div className="max-w-2xl mx-auto">
          <div className="pt-4 mb-6">
            <Link href="/dashboard" className="text-[#0f3d52] font-semibold text-sm hover:underline">← Mis obras</Link>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-[#e8e8e8]">
            <h1 className="font-black text-2xl text-[#0f3d52] mb-6">Nueva obra</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold text-[#0f3d52] mb-2">Nombre de la obra *</label>
                <input
                  type="text"
                  placeholder="Ej: Reforma vivienda Calle Mayor 12"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#e8e8e8] focus:border-[#0f3d52] outline-none text-[#0f3d52] font-medium placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0f3d52] mb-2">Dirección *</label>
                <input
                  type="text"
                  placeholder="Ej: Calle Mayor 12, Madrid"
                  value={direccion}
                  onChange={e => setDireccion(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#e8e8e8] focus:border-[#0f3d52] outline-none text-[#0f3d52] font-medium placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0f3d52] mb-2">Nombre del cliente</label>
                <input
                  type="text"
                  placeholder="Ej: Juan García"
                  value={clienteNombre}
                  onChange={e => setClienteNombre(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#e8e8e8] focus:border-[#0f3d52] outline-none text-[#0f3d52] font-medium placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0f3d52] mb-2">Descripción</label>
                <textarea
                  placeholder="Descripción opcional de la obra..."
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#e8e8e8] focus:border-[#0f3d52] outline-none text-[#0f3d52] font-medium placeholder:text-gray-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0f3d52] mb-2">Fecha de inicio</label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={e => setFechaInicio(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#e8e8e8] focus:border-[#0f3d52] outline-none text-[#0f3d52] font-medium"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#0f3d52] text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-[#1a5c78] transition-all disabled:opacity-50"
              >
                {loading ? 'Creando obra...' : 'Crear obra'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}