'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useParams } from 'next/navigation'
import QRCode from 'qrcode'
import Link from 'next/link'

export default function VerQR() {
  const { supabase } = useAuth()
  const { id } = useParams()
  const [obra, setObra] = useState(null)
  const [qrUrl, setQrUrl] = useState('')
  const canvasRef = useRef(null)

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase
        .from('obras')
        .select('*')
        .eq('id', id)
        .single()

      if (data) {
        setObra(data)
        const url = `https://obraqr.vercel.app/qr/${data.slug}`
        const dataUrl = await QRCode.toDataURL(url, { width: 400, margin: 2 })
        setQrUrl(dataUrl)
      }
    }
    cargar()
  }, [id])

  function descargar() {
    const a = document.createElement('a')
    a.href = qrUrl
    a.download = `qr-${obra?.slug}.png`
    a.click()
  }

  if (!obra) return <div>Cargando...</div>

  return (
    <div>
      <Link href={`/dashboard/obra/${id}`}>← Volver a la obra</Link>
      <h1>QR — {obra.nombre}</h1>
      <p>Comparte este QR con tu cliente para que vea el progreso de la obra.</p>
      {qrUrl && <img src={qrUrl} alt="QR de la obra" />}
      <button onClick={descargar}>Descargar QR</button>
    </div>
  )
}