import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function ObraPublica({ params }) {
  const { slug } = await params

  const { data: obra } = await supabase
    .from('obras')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!obra) {
    return <div>Obra no encontrada.</div>
  }

  const { data: updates } = await supabase
    .from('updates')
    .select('*, update_images(*)')
    .eq('obra_id', obra.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1>{obra.nombre}</h1>
      <p>{obra.direccion}</p>
      <p>Estado: {obra.estado}</p>
      {obra.fecha_inicio && (
        <p>Inicio: {new Date(obra.fecha_inicio).toLocaleDateString('es-ES')}</p>
      )}

      <h2>Actualizaciones</h2>

      {updates && updates.length === 0 && (
        <p>No hay actualizaciones todavía.</p>
      )}

      {updates && updates.map(update => (
        <div key={update.id}>
          <p>{new Date(update.created_at).toLocaleDateString('es-ES')}</p>
          <p>{update.texto}</p>
          {update.update_images?.map(img => (
            <img key={img.id} src={img.storage_url} alt="" style={{width: '200px'}} />
          ))}
        </div>
      ))}
    </div>
  )
}