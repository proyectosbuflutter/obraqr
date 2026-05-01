'use client'

import { useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter, useParams } from 'next/navigation'

export default function NuevaActualizacion() {
  const { user, supabase } = useAuth()
  const router = useRouter()
  const { id } = useParams()
  const [texto, setTexto] = useState('')
  const [fotos, setFotos] = useState([])
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

    const { data: updateData, error: updateError } = await supabase
      .from('updates')
      .insert({
        obra_id: id,
        user_id: user.id,
        texto
      })
      .select()
      .single()

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    for (let i = 0; i < fotos.length; i++) {
      const foto = fotos[i]
      const fileName = `${id}/${updateData.id}/${Date.now()}-${foto.name}`

      const { error: uploadError } = await supabase.storage
        .from('obras')
        .upload(fileName, foto)

      if (uploadError) {
        setError(uploadError.message)
        setLoading(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('obras')
        .getPublicUrl(fileName)

      await supabase.from('update_images').insert({
        update_id: updateData.id,
        storage_url: urlData.publicUrl,
        orden: i
      })
    }

    router.push(`/dashboard/obra/${id}`)
  }

  return (
    <div>
      <h1>Nueva actualización</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="¿Qué se ha hecho hoy?"
          value={texto}
          onChange={e => setTexto(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={e => setFotos(Array.from(e.target.files))}
        />
        {error && <p>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Publicando...' : 'Publicar actualización'}
        </button>
      </form>
    </div>
  )
}