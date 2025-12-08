import './globals.css'
import { Inter } from 'next/font/google'

// Inter font initialize karo
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MPP File Reader - Microsoft Project Viewer',
  description: 'Upload and view Microsoft Project (.mpp) files directly in browser',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}