'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function DetalleObra() {
  const { user, supabase } = useAuth()
  const router = useRouter()
  const { id } = useParams()
  const [obra, setObra] = useState(null)
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    async function cargarObra() {
      const { data: obraData } = await supabase
        .from('obras')
        .select('*')
        .eq('id', id)
        .single()

      if (!obraData) {
        router.push('/dashboard')
        return
      }

      setObra(obraData)

      const { data: updatesData } = await supabase
        .from('updates')
        .select('*, update_images(*)')
        .eq('obra_id', id)
        .order('created_at', { ascending: false })

      setUpdates(updatesData || [])
      setLoading(false)
    }

    cargarObra()
  }, [user, id])

  if (loading) return <div>Cargando...</div>
  if (!obra) return null

  return (
    <div>
      <div>
        <Link href="/dashboard">← Mis obras</Link>
      </div>

      <h1>{obra.nombre}</h1>
      <p>{obra.direccion}</p>
      <p>Estado: {obra.estado}</p>
      {obra.fecha_inicio && <p>Inicio: {new Date(obra.fecha_inicio).toLocaleDateString('es-ES')}</p>}

      <div>
        <Link href={`/dashboard/obra/${id}/nueva-actualizacion`}>+ Nueva actualización</Link>
        <Link href={`/dashboard/qr/${id}`}>Ver QR</Link>
        <a href={`/qr/${obra.slug}`} target="_blank">Ver página cliente</a>
      </div>

      <h2>Actualizaciones</h2>

      {updates.length === 0 && <p>No hay actualizaciones todavía.</p>}

      {updates.map(update => (
        <div key={update.id}>
          <p>{new Date(update.created_at).toLocaleDateString('es-ES')}</p>
          <p>{update.texto}</p>
          {update.update_images?.map(img => (
            <img key={img.id} src={img.storage_url} alt="" style={{width: '100px'}} />
          ))}
        </div>
      ))}
    </div>
  )
}