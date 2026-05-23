"use client"

import { useState, useMemo } from "react"
import { TorrentMetadata } from "@/types/torrent"
import { formatBytes } from "@/utils/formatBytes"
import { getFileType } from "@/utils/getFileType"
import {
  ShieldAlert,
  Radio,
  Clock,
  Settings,
  AlertTriangle,
  CheckCircle,
  Copy,
  Check,
  Globe,
  Database,
  Calendar,
  Cpu,
} from "lucide-react"

interface Props {
  metadata: TorrentMetadata
}

export default function StatisticsPanel({ metadata }: Props) {
  // --- Copy Trackers helper ---
  const [copiedTrackers, setCopiedTrackers] = useState(false)
  const handleCopyTrackers = async () => {
    if (!metadata.announce || metadata.announce.length === 0) return
    try {
      await navigator.clipboard.writeText(metadata.announce.join("\n"))
      setCopiedTrackers(true)
      setTimeout(() => setCopiedTrackers(false), 2000)
    } catch (e) {}
  }

  // --- Security Risk Score calculation ---
  const securityReport = useMemo(() => {
    let score = 100
    const issues: string[] = []
    let dangerousExtensionsCount = 0
    let suspiciousKeywordsCount = 0

    const suspiciousKeywords = ["crack", "keygen", "patch", "bypass", "serial", "hack", "loader"]
    const executableExtensions = ["exe", "bat", "msi", "cmd", "sh", "lnk", "vbs", "com"]

    metadata.files.forEach((file) => {
      const lowerName = file.name.toLowerCase()
      const ext = lowerName.split(".").pop() || ""

      // 1. Executable file detector
      if (executableExtensions.includes(ext)) {
        dangerousExtensionsCount++
      }

      // 2. Double extension detector
      const parts = lowerName.split(".")
      if (parts.length > 2) {
        const preExt = parts[parts.length - 2]
        // Check if pre-extension is media but last extension is executable
        if (executableExtensions.includes(ext) && ["mp4", "mkv", "avi", "pdf", "zip", "rar"].includes(preExt)) {
          issues.push(`Spoofed media extension: "${file.name}"`)
          score -= 30
        }
      }

      // 3. Suspicious keyword finder
      suspiciousKeywords.forEach((kw) => {
        if (lowerName.includes(kw)) {
          suspiciousKeywordsCount++
        }
      })
    })

    if (dangerousExtensionsCount > 0) {
      issues.push(`Contains ${dangerousExtensionsCount} executable/script file(s)`)
      score -= Math.min(dangerousExtensionsCount * 15, 45)
    }
    if (suspiciousKeywordsCount > 0) {
      issues.push(`Found ${suspiciousKeywordsCount} suspicious activation keyword(s)`)
      score -= Math.min(suspiciousKeywordsCount * 10, 30)
    }

    // Bound score
    const finalScore = Math.max(score, 5)

    let rating = "Clean"
    let ratingColor = "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
    let statusIcon = <CheckCircle className="h-5 w-5 text-emerald-400" />
    if (finalScore < 50) {
      rating = "Critical Risk"
      ratingColor = "text-rose-400 border-rose-500/20 bg-rose-500/10 glow-rose"
      statusIcon = <AlertTriangle className="h-5 w-5 text-rose-400" />
    } else if (finalScore < 85) {
      rating = "Caution Required"
      ratingColor = "text-amber-400 border-amber-500/20 bg-amber-500/10"
      statusIcon = <AlertTriangle className="h-5 w-5 text-amber-400" />
    }

    return {
      score: finalScore,
      issues,
      rating,
      ratingColor,
      statusIcon,
    }
  }, [metadata])

  // --- Trackers calculations ---
  const trackersReport = useMemo(() => {
    const announceList = metadata.announce || []
    const protocols: Record<string, number> = {
      udp: 0,
      http: 0,
      https: 0,
      ws: 0,
      other: 0,
    }

    announceList.forEach((url) => {
      const lower = url.toLowerCase()
      if (lower.startsWith("udp://")) protocols.udp++
      else if (lower.startsWith("https://")) protocols.https++
      else if (lower.startsWith("http://")) protocols.http++
      else if (lower.startsWith("ws://") || lower.startsWith("wss://")) protocols.ws++
      else protocols.other++
    })

    return {
      announceList,
      protocols,
    }
  }, [metadata])

  // --- File Size Space Distribution ---
  const spaceDistribution = useMemo(() => {
    const totals: Record<string, number> = {
      video: 0,
      image: 0,
      archive: 0,
      audio: 0,
      executable: 0,
      other: 0,
    }

    metadata.files.forEach((f) => {
      const type = getFileType(f.name)
      if (type in totals) {
        totals[type] += f.length
      } else {
        totals.other += f.length
      }
    })

    const distributionList = Object.entries(totals)
      .map(([type, size]) => ({
        type,
        size,
        pct: metadata.size > 0 ? (size / metadata.size) * 100 : 0,
      }))
      .sort((a, b) => b.size - a.size)

    return distributionList
  }, [metadata])

  // --- Download Speed Calculator ---
  const [downloadSpeed, setDownloadSpeed] = useState<number>(100) // in Mbps
  const [swarmHealth, setSwarmHealth] = useState<number>(0.75) // multiplier

  const estTimeStr = useMemo(() => {
    const bytes = metadata.size
    if (bytes <= 0) return "0s"

    // Mbps to MB/s: speed * 1,000,000 bits/sec / 8 bits/byte / 1,024 / 1,024 = speed / 8.388
    // To make it simple: 1 Mbps = 125,000 bytes/sec
    const speedBytesPerSec = (downloadSpeed * 1000000) / 8
    const actualBytesPerSec = speedBytesPerSec * swarmHealth

    if (actualBytesPerSec <= 0) return "∞"

    const seconds = bytes / actualBytesPerSec
    if (seconds < 60) return `${Math.ceil(seconds)}s`

    const minutes = seconds / 60
    if (minutes < 60) return `${Math.floor(minutes)}m ${Math.ceil(seconds % 60)}s`

    const hours = minutes / 60
    if (hours < 24) return `${Math.floor(hours)}h ${Math.ceil(minutes % 60)}m`

    return `${Math.floor(hours / 24)}d ${Math.ceil(hours % 24)}h`
  }, [metadata, downloadSpeed, swarmHealth])

  // --- General fields ---
  const formattedCreationDate = useMemo(() => {
    if (!metadata.created) return null
    try {
      const d = new Date(metadata.created)
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (e) {
      return metadata.created
    }
  }, [metadata])

  const totalPieces = useMemo(() => {
    if (!metadata.pieceLength || metadata.pieceLength <= 0) return 0
    return Math.ceil(metadata.size / metadata.pieceLength)
  }, [metadata])

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
      
      {/* LEFT COLUMN (lg:8): Security, Distribution, Trackers */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Security Quotient Widget */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/25 bg-rose-500/10">
                <ShieldAlert className="h-4 w-4 text-rose-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Security Scan Report</h2>
                <p className="text-xs text-zinc-600">Automated structural risk assessment</p>
              </div>
            </div>
            <div className={`flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-semibold uppercase tracking-wider ${securityReport.ratingColor}`}>
              {securityReport.statusIcon}
              {securityReport.rating}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 items-center border-t border-white/5 pt-6">
            <div className="flex flex-col items-center justify-center text-center p-4 rounded-xl bg-white/[0.015] border border-white/5">
              <span className="section-label mb-2">Safety Score</span>
              <div className="relative flex items-center justify-center h-28 w-28">
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" stroke="rgba(255,255,255,0.03)" strokeWidth="6" fill="transparent" />
                  <circle
                    cx="56" cy="56" r="48"
                    stroke={securityReport.score > 80 ? "#10b981" : securityReport.score > 50 ? "#f59e0b" : "#f43f5e"}
                    strokeWidth="6" fill="transparent"
                    strokeDasharray={2 * Math.PI * 48}
                    strokeDashoffset={2 * Math.PI * 48 * (1 - securityReport.score / 100)}
                    style={{ transition: "stroke-dashoffset 0.8s ease" }}
                  />
                </svg>
                <span className="font-sans text-xl font-extrabold tracking-tight">{securityReport.score}%</span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="section-label">Scan Checklist findings</span>
              {securityReport.issues.length === 0 ? (
                <div className="flex items-center gap-2.5 text-sm text-emerald-400/90 rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-3.5">
                  <CheckCircle className="h-4.5 w-4.5 shrink-0" />
                  <span>No security risks found. File structure is safe.</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {securityReport.issues.map((issue, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-sm text-amber-300 bg-amber-500/5 border border-amber-500/10 p-3 rounded-lg">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                      <span>{issue}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Space Utilization Distribution Card */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/25 bg-cyan-500/10">
                <Database className="h-4 w-4 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Size Utilization</h2>
                <p className="text-xs text-zinc-600">Storage share distribution by file category</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Visual stacked bar chart */}
            <div className="h-3 w-full rounded-full overflow-hidden flex bg-white/5">
              {spaceDistribution.map((item, idx) => {
                if (item.size === 0) return null
                const colors = [
                  "bg-blue-500",
                  "bg-pink-500",
                  "bg-amber-500",
                  "bg-emerald-500",
                  "bg-rose-500",
                  "bg-zinc-500",
                ]
                return (
                  <div
                    key={item.type}
                    className={`h-full ${colors[idx % colors.length]}`}
                    style={{ width: `${item.pct}%` }}
                    title={`${item.type}: ${item.pct.toFixed(1)}%`}
                  />
                )
              })}
            </div>

            {/* List with detail counters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {spaceDistribution.map((item, idx) => {
                const colors = [
                  "bg-blue-500 text-blue-400 border-blue-500/20",
                  "bg-pink-500 text-pink-400 border-pink-500/20",
                  "bg-amber-500 text-amber-400 border-amber-500/20",
                  "bg-emerald-500 text-emerald-400 border-emerald-500/20",
                  "bg-rose-500 text-rose-400 border-rose-500/20",
                  "bg-zinc-500 text-zinc-400 border-zinc-500/20",
                ]
                const colStr = colors[idx % colors.length]
                const dotCol = colStr.split(" ")[0]

                return (
                  <div key={item.type} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] p-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`h-2.5 w-2.5 rounded-full ${dotCol}`} />
                      <span className="text-sm font-semibold capitalize text-white/95">{item.type}</span>
                    </div>
                    <div className="text-right">
                      <span className="mono text-xs text-zinc-400 mr-2">{formatBytes(item.size)}</span>
                      <span className="mono text-xs font-semibold text-zinc-500">({item.pct.toFixed(1)}%)</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Announce Trackers Widget */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-500/25 bg-purple-500/10">
                <Radio className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Announce Trackers</h2>
                <p className="text-xs text-zinc-600">Inbound announce network configurations</p>
              </div>
            </div>

            {trackersReport.announceList.length > 0 && (
              <button
                onClick={handleCopyTrackers}
                className="flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/4 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-all hover:border-blue-500/30 hover:text-blue-400"
              >
                {copiedTrackers ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copied List</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy All Announce URLs</span>
                  </>
                )}
              </button>
            )}
          </div>

          {trackersReport.announceList.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center bg-white/[0.01] border border-white/5 rounded-xl">
              <Globe className="h-7 w-7 text-zinc-700" />
              <p className="text-sm text-zinc-500">No trackers parsed in this metadata file.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Protocol share indicators */}
              <div className="flex flex-wrap gap-2">
                {Object.entries(trackersReport.protocols).map(([protocol, count]) => {
                  if (count === 0) return null
                  return (
                    <span key={protocol} className="mono text-[10px] uppercase font-semibold px-2 py-1 rounded-md border border-white/8 bg-white/4 text-zinc-400">
                      {protocol}: {count}
                    </span>
                  )
                })}
              </div>

              {/* Scrollable announce tracker rows */}
              <div className="max-h-[220px] overflow-y-auto border border-white/5 rounded-xl bg-white/[0.005]">
                {trackersReport.announceList.map((url, idx) => {
                  const isUdp = url.toLowerCase().startsWith("udp://")
                  const isHttps = url.toLowerCase().startsWith("https://")
                  return (
                    <div key={idx} className="mono text-xs flex items-center justify-between border-b border-white/5 last:border-b-0 px-4 py-2.5 hover:bg-white/[0.02]">
                      <span className="truncate text-zinc-400 pr-4">{url}</span>
                      <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        isUdp ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                        isHttps ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                      }`}>
                        {isUdp ? "udp" : isHttps ? "https" : "http"}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN (lg:4): Speed Calculator & Pieces Diagnostic */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Speed Calculator Widget */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/25 bg-emerald-500/10">
              <Clock className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Download Estimator</h2>
              <p className="text-xs text-zinc-600">Simulate file completion speeds</p>
            </div>
          </div>

          <div className="space-y-6 border-t border-white/5 pt-5">
            {/* Display time */}
            <div className="text-center py-4 rounded-xl bg-white/[0.015] border border-white/5">
              <span className="section-label">Est. Download Duration</span>
              <p className="font-syne text-3xl font-black text-emerald-400 tracking-tight mt-1.5">
                {estTimeStr}
              </p>
            </div>

            {/* Slider 1: Connection Speed */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Connection Bandwidth</span>
                <span className="mono font-bold text-white">{downloadSpeed} Mbps</span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={downloadSpeed}
                onChange={(e) => setDownloadSpeed(Number(e.target.value))}
                className="w-full h-1.5 rounded-full bg-white/10 accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-600">
                <span>10 Mbps</span>
                <span>500 Mbps</span>
                <span>1 Gbps</span>
              </div>
            </div>

            {/* Slider 2: Swarm Health density multiplier */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Swarm peer density</span>
                <span className="mono font-bold text-white">{Math.round(swarmHealth * 100)}% speed</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="1.0"
                step="0.05"
                value={swarmHealth}
                onChange={(e) => setSwarmHealth(Number(e.target.value))}
                className="w-full h-1.5 rounded-full bg-white/10 accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-600">
                <span>Seedless (5%)</span>
                <span>Average (50%)</span>
                <span>Ideal (100%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Piece diagnostics & client metrics */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-500/25 bg-blue-500/10">
              <Cpu className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Decoded Diagnostics</h2>
              <p className="text-xs text-zinc-600">Bencoded payload specifications</p>
            </div>
          </div>

          <div className="space-y-3.5 border-t border-white/5 pt-5 text-sm">
            
            {/* Piece Size */}
            <div className="flex justify-between items-center py-1.5 border-b border-white/[0.03]">
              <span className="text-zinc-500">Piece sizing</span>
              <span className="mono font-semibold text-white">
                {metadata.pieceLength && metadata.pieceLength > 0 ? formatBytes(metadata.pieceLength) : "Unknown"}
              </span>
            </div>

            {/* Pieces count */}
            <div className="flex justify-between items-center py-1.5 border-b border-white/[0.03]">
              <span className="text-zinc-500">Pieces total</span>
              <span className="mono font-semibold text-white">
                {totalPieces > 0 ? totalPieces.toLocaleString() : "Unknown"}
              </span>
            </div>

            {/* Created By / Client */}
            <div className="flex justify-between items-center py-1.5 border-b border-white/[0.03]">
              <span className="text-zinc-500">Creator Agent</span>
              <span className="mono font-semibold text-white truncate max-w-[160px]" title={metadata.createdBy}>
                {metadata.createdBy || "Anonymous"}
              </span>
            </div>

            {/* Creation Date */}
            <div className="flex justify-between items-center py-1.5 border-b border-white/[0.03]">
              <span className="text-zinc-500">Creation date</span>
              <span className="mono text-xs text-zinc-400 font-semibold text-right max-w-[180px]">
                {formattedCreationDate || "Not Declared"}
              </span>
            </div>

            {/* Comment string */}
            {metadata.comment && (
              <div className="flex flex-col gap-1.5 pt-2">
                <span className="text-zinc-500 text-xs">Torrent comment:</span>
                <p className="text-xs text-zinc-400 bg-white/[0.01] border border-white/5 p-2 rounded-lg italic">
                  "{metadata.comment}"
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  )
}
