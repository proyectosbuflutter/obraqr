import { AuthProvider } from './context/AuthContext'
import './globals.css'

export const metadata = {
  title: 'ObraQR',
  description: 'Diario de obra digital',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}