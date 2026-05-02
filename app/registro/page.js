'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Registro() {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegistro(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signUp({ email, password, options: { data: { nombre } } })
    if (authError) { setError(authError.message); setLoading(false); return }
    await supabase.from('users').insert({ id: data.user.id, email, nombre, plan: 'gratis' })
    router.push('/onboarding')
  }

  return (
    <div className="min-h-screen bg-[#F5B800] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <img src="/obraqr.png" alt="ObraQR" className="h-16 w-auto mx-auto mb-6" />
          </Link>
          <h1 className="font-black text-3xl text-[#0f3d52] tracking-tight">Crea tu cuenta gratis</h1>
          <p className="text-[#0f3d52]/60 mt-2">Sin tarjeta de crédito. En 30 segundos.</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <form onSubmit={handleRegistro} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0f3d52] mb-2">Tu nombre</label>
              <input
                type="text"
                placeholder="Juan García"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-[#e8e8e8] focus:border-[#0f3d52] outline-none text-[#0f3d52] font-medium placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0f3d52] mb-2">Email</label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-[#e8e8e8] focus:border-[#0f3d52] outline-none text-[#0f3d52] font-medium placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0f3d52] mb-2">Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-[#e8e8e8] focus:border-[#0f3d52] outline-none text-[#0f3d52] font-medium placeholder:text-gray-400"
              />
            </div>
            {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#0f3d52] text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-[#1a5c78] transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>
          </form>
          <p className="text-center text-sm text-[#555] mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-[#0f3d52] font-bold hover:underline">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  )
}