"use client"

import { Activity } from "lucide-react"
import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50">
      {/* Glass bar */}
      <div className="relative border-b border-white/[0.07] bg-[rgba(8,9,12,0.75)] backdrop-blur-2xl">
        {/* Top shimmer line */}
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Left: Logo + wordmark */}
          <div className="flex items-center gap-3">
            {/* Wordmark + tagline */}
            <div>
              <h1 className="font-syne text-lg font-extrabold leading-none tracking-tight gradient-text">
                BitReveal
              </h1>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-600">
                Intelligence Platform
              </p>
            </div>
          </div>

          {/* Center: Nav links */}
          <div className="hidden items-center gap-1 md:flex">
            {[
              { label: "Analyzer", active: true },
              { label: "Statistics", active: false },
            ].map((item) => (
              <button
                key={item.label}
                className={`
                  relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200
                  ${item.active
                    ? "text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                  }
                `}
              >
                {item.active && (
                  <span className="absolute inset-0 rounded-lg bg-white/8" />
                )}
                <span className="relative">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Right: Status */}
          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 md:flex">
              <Activity className="h-3 w-3 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">
                Live
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav >
  )
}