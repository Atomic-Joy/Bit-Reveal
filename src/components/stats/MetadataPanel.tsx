"use client"

import {
  Copy,
  Check,
  Database,
  FileDigit,
  Hash,
  HardDrive,
  Layers,
} from "lucide-react"

import { useState } from "react"

import { TorrentMetadata } from "@/types/torrent"
import { formatBytes } from "@/utils/formatBytes"

interface Props {
  metadata: TorrentMetadata
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/4 px-2.5 py-1 text-xs font-medium text-zinc-500 transition-all hover:border-blue-500/40 hover:text-blue-400"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-emerald-400" />
          <span className="text-emerald-400">Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          Copy
        </>
      )}
    </button>
  )
}

interface DataCellProps {
  label: string
  value: string | number
  icon: React.ReactNode
  accent: string
  mono?: boolean
  truncate?: boolean
  action?: React.ReactNode
  span?: boolean
}

function DataCell({
  label,
  value,
  icon,
  accent,
  mono = false,
  truncate = false,
  action,
  span = false,
}: DataCellProps) {
  return (
    <div
      className={`data-cell ${span ? "md:col-span-2" : ""}`}
      style={{ "--cell-accent": accent } as React.CSSProperties}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-zinc-600">{icon}</span>
          <span className="section-label">{label}</span>
        </div>
        {action}
      </div>
      <p
        className={`
          text-white font-semibold leading-snug
          ${mono ? "mono text-sm" : "text-base"}
          ${truncate ? "truncate" : "break-all"}
        `}
        title={String(value)}
      >
        {value}
      </p>
    </div>
  )
}

export default function MetadataPanel({
  metadata,
}: Props) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 backdrop-blur-xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-500/25 bg-blue-500/10">
            <Database className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              Torrent Information
            </h2>
            <p className="text-xs text-zinc-600">
              Decoded metadata fields
            </p>
          </div>
        </div>

        <div className="rounded-full border border-white/8 bg-white/4 px-3 py-1">
          <span className="section-label text-zinc-500">
            {Object.keys(metadata).length} fields
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="mb-6 h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

      {/* Grid */}
      <div className="grid gap-3 md:grid-cols-2">
        <DataCell
          label="Name"
          value={metadata.name}
          icon={<FileDigit className="h-3.5 w-3.5" />}
          accent="rgba(59, 130, 246, 0.7)"
          truncate
          span
        />

        <DataCell
          label="Total Size"
          value={formatBytes(metadata.size)}
          icon={<HardDrive className="h-3.5 w-3.5" />}
          accent="rgba(168, 85, 247, 0.7)"
          mono
        />

        <DataCell
          label="File Count"
          value={`${metadata.files.length} files`}
          icon={<Layers className="h-3.5 w-3.5" />}
          accent="rgba(34, 211, 238, 0.7)"
          mono
        />

        <DataCell
          label="Info Hash"
          value={metadata.infoHash}
          icon={<Hash className="h-3.5 w-3.5" />}
          accent="rgba(16, 185, 129, 0.7)"
          mono
          action={<CopyButton text={metadata.infoHash} />}
          span
        />
      </div>
    </div>
  )
}