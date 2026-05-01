import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const estadoConfig = {
  en_curso: { label: 'En curso', color: '#4CAF50' },
  pausada: { label: 'Pausada', color: '#F5B800' },
  terminada: { label: 'Terminada', color: '#1a5c78' },
}

export default async function ObraPublica({ params }) {
  const { slug } = await params

  const { data: obra } = await supabase
    .from('obras').select('*').eq('slug', slug).single()

  if (!obra) {
    return (
      <div style={{ minHeight: '100vh', background: '#F5B800', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ background: 'white', borderRadius: 16, padding: '48px', textAlign: 'center' }}>
          <p style={{ fontSize: '3rem', marginBottom: '16px' }}>🏗️</p>
          <h1 style={{ color: '#0f3d52', fontWeight: 900, fontSize: '1.5rem', marginBottom: '8px' }}>Obra no encontrada</h1>
          <p style={{ color: '#555' }}>El enlace puede haber caducado o ser incorrecto.</p>
        </div>
      </div>
    )
  }

  const { data: updates } = await supabase
    .from('updates').select('*, update_images(*)').eq('obra_id', obra.id).order('created_at', { ascending: false })

  const estado = estadoConfig[obra.estado] || estadoConfig.en_curso

  return (
    <div style={{ minHeight: '100vh', background: '#F5B800', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* HEADER */}
      <header style={{ background: '#0f3d52', padding: '0 32px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <img src="https://obraqr.vercel.app/obraqr.png" alt="ObraQR" style={{ height: '48px', width: 'auto' }} />
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Diario de obra digital</span>
      </header>

      <main style={{ padding: '32px 24px', maxWidth: '720px', margin: '0 auto' }}>

        {/* INFO OBRA */}
        <div style={{ background: '#0f3d52', borderRadius: '20px', padding: '28px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
            <div>
              <h1 style={{ color: 'white', fontWeight: 900, fontSize: '1.6rem', marginBottom: '6px', lineHeight: 1.2 }}>{obra.nombre}</h1>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', marginBottom: '4px' }}>{obra.direccion}</p>
              {obra.fecha_inicio && (
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                  Inicio: {new Date(obra.fecha_inicio).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
            <span style={{ background: `${estado.color}22`, color: estado.color, padding: '6px 14px', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0 }}>
              {estado.label}
            </span>
          </div>
        </div>

        {/* TIMELINE */}
        <h2 style={{ color: '#0f3d52', fontWeight: 900, fontSize: '1.1rem', marginBottom: '16px', letterSpacing: '-0.3px' }}>
          Actualizaciones {updates?.length > 0 && <span style={{ color: '#555', fontWeight: 400, fontSize: '0.9rem' }}>({updates.length})</span>}
        </h2>

        {(!updates || updates.length === 0) && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
            <p style={{ color: '#555', fontSize: '0.95rem' }}>El constructor aún no ha subido actualizaciones.</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {updates?.map(update => (
            <div key={update.id} style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #eee' }}>
              <p style={{ color: '#888', fontSize: '0.78rem', fontWeight: 600, marginBottom: '12px' }}>
                {new Date(update.created_at).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                {update.update_images?.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    {update.update_images.map(img => (
                      <img key={img.id} src={img.storage_url} alt="" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px' }} />
                    ))}
                  </div>
                )}
                <p style={{ color: '#0f3d52', fontWeight: 500, lineHeight: 1.6, fontSize: '0.95rem' }}>{update.texto}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div style={{ textAlign: 'center', padding: '40px 0 20px', color: 'rgba(0,0,0,0.3)', fontSize: '0.75rem' }}>
          Powered by <strong style={{ color: '#0f3d52' }}>ObraQR</strong>
        </div>
      </main>
    </div>
  )
}