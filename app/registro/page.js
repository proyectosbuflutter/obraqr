'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

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

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nombre }
      }
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    await supabase.from('users').insert({
      id: data.user.id,
      email,
      nombre,
      plan: 'gratis'
    })

    router.push('/onboarding')
  }

  return (
    <div>
      <h1>Crear cuenta</h1>
      <form onSubmit={handleRegistro}>
        <input
          type="text"
          placeholder="Tu nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <p>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>
    </div>
  )
}