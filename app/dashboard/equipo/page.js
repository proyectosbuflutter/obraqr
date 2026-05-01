'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'

export default function Equipo() {
  const { user, supabase } = useAuth()
  const [perfil, setPerfil] = useState(null)
  const [equipo, setEquipo] = useState([])
  const [email, setEmail] = useState('')
  const [rol, setRol] = useState('operario')
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    if (!user) return
    async function cargar() {
      const { data: perfilData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      setPerfil(perfilData)

      if (perfilData?.plan === 'business') {
        const { data: equipoData } = await supabase
          .from('equipo')
          .select('*')
          .eq('owner_id', user.id)
        setEquipo(equipoData || [])
      }
    }
    cargar()
  }, [user])

  async function handleInvitar(e) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('equipo')
      .insert({ owner_id: user.id, email, rol })

    if (error) {
      setMensaje('Error al invitar: ' + error.message)
    } else {
      setMensaje('Invitación enviada.')
      setEmail('')
      const { data } = await supabase.from('equipo').select('*').eq('owner_id', user.id)
      setEquipo(data || [])
    }

    setLoading(false)
    setTimeout(() => setMensaje(''), 3000)
  }

  if (!perfil) return <div>Cargando...</div>

  if (perfil.plan !== 'business') {
    return (
      <div>
        <h1>Equipo</h1>
        <p>Esta función solo está disponible en el plan Business.</p>
        <a href="/dashboard/cuenta">Ver planes</a>
      </div>
    )
  }

  return (
    <div>
      <h1>Equipo</h1>

      <form onSubmit={handleInvitar}>
        <input
          type="email"
          placeholder="Email del miembro"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <select value={rol} onChange={e => setRol(e.target.value)}>
          <option value="operario">Operario</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Invitando...' : 'Invitar'}
        </button>
      </form>

      {mensaje && <p>{mensaje}</p>}

      <h2>Miembros</h2>
      {equipo.length === 0 && <p>No hay miembros todavía.</p>}
      {equipo.map(miembro => (
        <div key={miembro.id}>
          <span>{miembro.email}</span>
          <span>{miembro.rol}</span>
          <span>{miembro.estado}</span>
        </div>
      ))}
    </div>
  )
}