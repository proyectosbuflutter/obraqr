'use client'

import { useState } from 'react'

export default function ImagenPopup({ imagenes }) {
  const [popupImg, setPopupImg] = useState(null)

  return (
    <>
      {popupImg && (
        <div
          onClick={() => setPopupImg(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', cursor: 'pointer' }}
        >
          <img src={popupImg} alt="" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '12px', objectFit: 'contain' }} />
          <button style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', width: '40px', height: '40px', borderRadius: '50%', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>
      )}
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        {imagenes.map(img => (
          <img
            key={img.id}
            src={img.storage_url}
            alt=""
            onClick={() => setPopupImg(img.storage_url)}
            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px', cursor: 'pointer' }}
          />
        ))}
      </div>
    </>
  )
}