import { createClient } from '@supabase/supabase-js'
import ImagenPopup from '@/app/components/ImagenPopup'

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

  const { data: fases } = await supabase
    .from('fases_obra').select('*').eq('obra_id', obra.id).order('orden')

  const todasLasImagenes = updates?.flatMap(u => u.update_images || []) || []
  const estado = estadoConfig[obra.estado] || estadoConfig.en_curso

  const diasTranscurridos = obra.fecha_inicio
    ? Math.floor((new Date() - new Date(obra.fecha_inicio)) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div style={{ minHeight: '100vh', background: '#F5B800', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* HEADER */}
      <header style={{ background: '#0f3d52', padding: '0 32px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <a href="/"><img src="https://obraqr.vercel.app/obraqr.png" alt="ObraQR" style={{ height: '48px', width: 'auto' }} /></a>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Diario de obra digital</span>
        <a href="/" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', padding: '8px 16px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>← Web</a>
      </header>

      <main style={{ padding: '32px 24px', maxWidth: '720px', margin: '0 auto' }}>

        {/* INFO OBRA */}
        <div style={{ background: '#0f3d52', borderRadius: '20px', padding: '28px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
            <div>
              <h1 style={{ color: 'white', fontWeight: 900, fontSize: '1.6rem', marginBottom: '6px', lineHeight: 1.2 }}>{obra.nombre}</h1>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', marginBottom: '4px' }}>{obra.direccion}</p>
              {obra.fecha_inicio && (
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                  Inicio: {new Date(obra.fecha_inicio).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
              {obra.fecha_fin_estimada && (
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '2px' }}>
                  Fin estimado: {new Date(obra.fecha_fin_estimada).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
            <span style={{ background: `${estado.color}22`, color: estado.color, padding: '6px 14px', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0 }}>
              {estado.label}
            </span>
          </div>

          {/* STATS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: obra.porcentaje_avance > 0 ? '20px' : '0' }}>
            {diasTranscurridos !== null && (
              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                <p style={{ color: 'white', fontWeight: 900, fontSize: '1.6rem', lineHeight: 1 }}>{diasTranscurridos}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginTop: '4px' }}>días en obra</p>
              </div>
            )}
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
              <p style={{ color: 'white', fontWeight: 900, fontSize: '1.6rem', lineHeight: 1 }}>{updates?.length || 0}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginTop: '4px' }}>actualizaciones</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
              <p style={{ color: 'white', fontWeight: 900, fontSize: '1.6rem', lineHeight: 1 }}>{todasLasImagenes.length}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginTop: '4px' }}>fotos</p>
            </div>
          </div>

          {/* BARRA DE PROGRESO */}
          {obra.porcentaje_avance > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 600 }}>Progreso de la obra</p>
                <p style={{ color: 'white', fontSize: '0.75rem', fontWeight: 900 }}>{obra.porcentaje_avance}%</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '99px', height: '8px', overflow: 'hidden' }}>
                <div style={{ background: '#4CAF50', height: '100%', width: `${obra.porcentaje_avance}%`, borderRadius: '99px', transition: 'width 0.5s' }} />
              </div>
            </div>
          )}
        </div>

        {/* CONTACTO */}
        {(obra.telefono_constructor || obra.whatsapp_constructor) && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '24px', display: 'flex', gap: '12px' }}>
            {obra.telefono_constructor && (
              <a href={`tel:${obra.telefono_constructor}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: '#0f3d52', borderRadius: '12px', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem' }}>
                📞 Llamar
              </a>
            )}
            {obra.whatsapp_constructor && (
              <a href={`https://wa.me/${obra.whatsapp_constructor.replace(/\D/g, '')}`} target="_blank" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: '#25D366', borderRadius: '12px', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem' }}>
                💬 WhatsApp
              </a>
            )}
          </div>
        )}

        {/* FASES */}
        {fases && fases.length > 0 && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
            <h2 style={{ color: '#0f3d52', fontWeight: 900, fontSize: '1rem', marginBottom: '16px' }}>Fases de la obra</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {fases.map(fase => {
                const completada = fase.estado === 'completada'
                const enCurso = fase.estado === 'en_curso'
                return (
                  <div key={fase.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: completada ? '#f0faf0' : enCurso ? '#fff8e1' : '#f5f5f5', borderRadius: '10px' }}>
                    <span style={{ fontSize: '1rem' }}>{completada ? '✅' : enCurso ? '🔄' : '⏳'}</span>
                    <span style={{ color: '#0f3d52', fontWeight: 600, fontSize: '0.9rem', flex: 1 }}>{fase.nombre}</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: completada ? '#388e3c' : enCurso ? '#f57c00' : '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {completada ? 'Completada' : enCurso ? 'En curso' : 'Pendiente'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* GALERIA */}
        {todasLasImagenes.length > 0 && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
            <h2 style={{ color: '#0f3d52', fontWeight: 900, fontSize: '1rem', marginBottom: '16px' }}>Galería de fotos ({todasLasImagenes.length})</h2>
            <ImagenPopup imagenes={todasLasImagenes} esGaleria={true} />
          </div>
        )}

        {/* TIMELINE */}
        <h2 style={{ color: '#0f3d52', fontWeight: 900, fontSize: '1.1rem', marginBottom: '16px' }}>
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
                  <ImagenPopup imagenes={update.update_images} />
                )}
                <p style={{ color: '#0f3d52', fontWeight: 500, lineHeight: 1.6, fontSize: '0.95rem' }}>{update.texto}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '40px 0 20px', color: 'rgba(0,0,0,0.3)', fontSize: '0.75rem' }}>
          Powered by <strong style={{ color: '#0f3d52' }}>ObraQR</strong>
        </div>
      </main>
    </div>
  )
}