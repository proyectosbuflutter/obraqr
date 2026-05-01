'use client'

import { useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'

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
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!user) {
      router.push('/login')
      return
    }

    const slug = generarSlug(nombre)

    const { data, error: dbError } = await supabase
      .from('obras')
      .insert({
        user_id: user.id,
        nombre,
        direccion,
        descripcion,
        slug,
        estado: 'en_curso',
        fecha_inicio: fechaInicio || null
      })
      .select()
      .single()

    if (dbError) {
      setError(dbError.message)
      setLoading(false)
      return
    }

    router.push(`/dashboard/obra/${data.id}`)
  }

  return (
    <div>
      <h1>Nueva obra</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre de la obra"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Dirección"
          value={direccion}
          onChange={e => setDireccion(e.target.value)}
          required
        />
        <textarea
          placeholder="Descripción (opcional)"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
        />
        <label>Fecha de inicio</label>
        <input
          type="date"
          value={fechaInicio}
          onChange={e => setFechaInicio(e.target.value)}
        />
        {error && <p>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear obra'}
        </button>
      </form>
    </div>
  )
}