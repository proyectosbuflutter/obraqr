import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function Dashboard() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        }
      }
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: obras } = await supabase
    .from('obras')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div>
        <h1>Mis obras</h1>
        <Link href="/dashboard/nueva-obra">+ Nueva obra</Link>
      </div>

      {obras && obras.length === 0 && (
        <p>No tienes obras todavía. ¡Crea la primera!</p>
      )}

      {obras && obras.map(obra => (
        <Link key={obra.id} href={`/dashboard/obra/${obra.id}`}>
          <div>
            <h2>{obra.nombre}</h2>
            <p>{obra.direccion}</p>
            <p>{obra.estado}</p>
            <p>{new Date(obra.created_at).toLocaleDateString('es-ES')}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}