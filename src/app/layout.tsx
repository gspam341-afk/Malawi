import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import './globals.css'
import { SiteHeader } from '@/components/SiteHeader'

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Jacaranda School — STEM learning activities',
  description:
    'Explore STEM through physical activities, printable materials and classroom challenges. For Jacaranda School students Grade 6 to Grade 14.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Moul&display=swap" rel="stylesheet" />
      </head>
      <body className="flex min-h-full flex-col bg-jac-offwhite text-jac-navy">
        <SiteHeader />
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-8 md:px-8 md:py-14">{children}</main>
      </body>
    </html>
  )
}
