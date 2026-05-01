'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Onboarding() {
  const { user, supabase } = useAuth()
  const router = useRouter()
  const [nombre, setNombre] = useState('')

  useEffect(() => {
    if (!user) return
    async function cargarNombre() {
      const { data } = await supabase
        .from('users')
        .select('nombre')
        .eq('id', user.id)
        .single()
      if (data) setNombre(data.nombre)
    }
    cargarNombre()
  }, [user])

  return (
    <div>
      <h1>¡Bienvenido{nombre ? `, ${nombre}` : ''}!</h1>
      <p>ObraQR es tu diario de obra digital. En menos de 2 minutos puedes tener tu primera obra lista.</p>

      <div>
        <div>
          <h2>1. Crea tu obra</h2>
          <p>Nombre, dirección y fecha de inicio. En 30 segundos está lista.</p>
        </div>
        <div>
          <h2>2. Sube una foto</h2>
          <p>Desde el móvil, en 10 segundos. Sin instalar nada.</p>
        </div>
        <div>
          <h2>3. Comparte el QR</h2>
          <p>Tu cliente escanea el QR y ve el progreso al instante.</p>
        </div>
      </div>

      <Link href="/dashboard/nueva-obra">Crear mi primera obra</Link>
      <Link href="/dashboard">Ir al dashboard</Link>
    </div>
  )
}