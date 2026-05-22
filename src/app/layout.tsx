import type { Metadata } from "next"

import {
  Inter,
  Space_Grotesk,
} from "next/font/google"

import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
})

export const metadata: Metadata = {
  title: "BitReveal",
  description:
    "Torrent Metadata Intelligence Platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${inter.variable}
          ${spaceGrotesk.variable}
          bg-black text-white antialiased
        `}
      >
        {children}
      </body>
    </html>
  )
}