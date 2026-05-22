import type { Metadata } from "next"

import {
  Inter,
  Space_Grotesk,
  Syne,
} from "next/font/google"

import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
})

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
})

export const metadata: Metadata = {
  title: "BitReveal — Torrent Intelligence Platform",
  description:
    "Analyze torrent metadata with clarity. Inspect file structures, detect suspicious content, and visualize torrent intelligence through a modern dashboard.",
  keywords: [
    "torrent analyzer",
    "torrent metadata",
    "torrent inspector",
    "BitReveal",
    "torrent intelligence",
  ],
  authors: [{ name: "BitReveal" }],
  openGraph: {
    title: "BitReveal — Torrent Intelligence Platform",
    description:
      "Inspect torrent structures, detect suspicious files, and visualize metadata.",
    type: "website",
  },
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
          ${syne.variable}
          antialiased
        `}
      >
        {children}
      </body>
    </html>
  )
}