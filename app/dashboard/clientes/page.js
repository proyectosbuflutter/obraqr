'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import Link from 'next/link'

export default function Clientes() {
  const { user, supabase } = useAuth()
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    async function cargar() {
      const { data } = await supabase
        .from('obras')
        .select('*')
        .eq('user_id', user.id)
        .not('cliente_nombre', 'is', null)
        .order('cliente_nombre')

      if (data) {
        const agrupado = data.reduce((acc, obra) => {
          const cliente = obra.cliente_nombre
          if (!acc[cliente]) acc[cliente] = []
          acc[cliente].push(obra)
          return acc
        }, {})
        setClientes(agrupado)
      }
      setLoading(false)
    }
    cargar()
  }, [user])

  if (loading) return <div>Cargando...</div>

  const clienteKeys = Object.keys(clientes)

  return (
    <div>
      <h1>Clientes</h1>

      {clienteKeys.length === 0 && (
        <p>No tienes clientes todavía. Añade el nombre del cliente al crear una obra.</p>
      )}

      {clienteKeys.map(cliente => (
        <div key={cliente}>
          <h2>{cliente}</h2>
          <p>{clientes[cliente].length} obra{clientes[cliente].length !== 1 ? 's' : ''}</p>
          {clientes[cliente].map(obra => (
            <Link key={obra.id} href={`/dashboard/obra/${obra.id}`}>
              <div>
                <span>{obra.nombre}</span>
                <span>{obra.estado}</span>
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  )
}