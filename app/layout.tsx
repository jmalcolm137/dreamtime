import type { Metadata, Viewport } from 'next'
import { Nunito, Baloo_2 } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' })
const baloo = Baloo_2({ subsets: ['latin'], variable: '--font-baloo' })

export const metadata: Metadata = {
  title: 'Dreamweaver - AI Bedtime Stories',
  description:
    'Create magical, personalized bedtime stories for your children using AI',
}

export const viewport: Viewport = {
  themeColor: '#1a1a3e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${baloo.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
