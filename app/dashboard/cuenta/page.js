'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function Cuenta() {
  const { user, supabase } = useAuth()
  const router = useRouter()
  const [perfil, setPerfil] = useState(null)
  const [nombre, setNombre] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [editando, setEditando] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    if (!user) return
    async function cargar() {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      if (data) {
        setPerfil(data)
        setNombre(data.nombre || '')
        setEmpresa(data.empresa || '')
      }
    }
    cargar()
  }, [user])

  async function handleGuardar() {
    setLoading(true)
    await supabase
      .from('users')
      .update({ nombre, empresa })
      .eq('id', user.id)
    setPerfil({ ...perfil, nombre, empresa })
    setEditando(false)
    setMensaje('Guardado correctamente.')
    setLoading(false)
    setTimeout(() => setMensaje(''), 3000)
  }

  async function handleCerrarSesion() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!perfil) return <div>Cargando...</div>

  return (
    <div>
      <h1>Mi cuenta</h1>

      <p>Email: {user?.email}</p>
      <p>Plan: {perfil.plan}</p>

      {editando ? (
        <div>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
          <input
            type="text"
            placeholder="Empresa"
            value={empresa}
            onChange={e => setEmpresa(e.target.value)}
          />
          <button onClick={handleGuardar} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button onClick={() => setEditando(false)}>Cancelar</button>
        </div>
      ) : (
        <div>
          <p>Nombre: {perfil.nombre}</p>
          <p>Empresa: {perfil.empresa || '—'}</p>
          <button onClick={() => setEditando(true)}>Editar</button>
        </div>
      )}

      {mensaje && <p>{mensaje}</p>}

      <button onClick={handleCerrarSesion}>Cerrar sesión</button>
    </div>
  )
}