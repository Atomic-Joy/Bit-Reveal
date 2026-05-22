import {
  FileArchive,
  FileCode,
  FileImage,
  FileVideo,
  Music,
  ShieldAlert,
  BarChart3,
} from "lucide-react"

import { TorrentFile } from "@/types/torrent"

import { getTorrentStats } from "@/utils/getTorrentStats"

interface Props {
  files: TorrentFile[]
}

interface StatConfig {
  icon: React.ReactNode
  color: string
  glow: string
  bg: string
  border: string
  label: string
}

function getStatConfig(ext: string): StatConfig {
  const videoExtensions = ["mp4", "mkv", "avi", "mov", "wmv", "flv"]
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"]
  const archiveExtensions = ["zip", "rar", "7z", "tar", "gz", "xz"]
  const executableExtensions = ["exe", "bat", "msi", "cmd", "sh", "dmg"]
  const audioExtensions = ["mp3", "flac", "wav", "aac", "ogg", "m4a"]

  if (videoExtensions.includes(ext)) {
    return {
      icon: <FileVideo className="h-5 w-5" />,
      color: "text-blue-400",
      glow: "glow-blue",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      label: "Video",
    }
  }
  if (imageExtensions.includes(ext)) {
    return {
      icon: <FileImage className="h-5 w-5" />,
      color: "text-pink-400",
      glow: "",
      bg: "bg-pink-500/10",
      border: "border-pink-500/20",
      label: "Image",
    }
  }
  if (archiveExtensions.includes(ext)) {
    return {
      icon: <FileArchive className="h-5 w-5" />,
      color: "text-amber-400",
      glow: "glow-amber",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      label: "Archive",
    }
  }
  if (executableExtensions.includes(ext)) {
    return {
      icon: <ShieldAlert className="h-5 w-5" />,
      color: "text-rose-400",
      glow: "glow-rose",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      label: "Executable",
    }
  }
  if (audioExtensions.includes(ext)) {
    return {
      icon: <Music className="h-5 w-5" />,
      color: "text-emerald-400",
      glow: "glow-emerald",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      label: "Audio",
    }
  }
  return {
    icon: <FileCode className="h-5 w-5" />,
    color: "text-zinc-400",
    glow: "",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/20",
    label: "Other",
  }
}

function getProgressColor(ext: string): string {
  const videoExtensions = ["mp4", "mkv", "avi", "mov", "wmv", "flv"]
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"]
  const archiveExtensions = ["zip", "rar", "7z", "tar", "gz", "xz"]
  const executableExtensions = ["exe", "bat", "msi", "cmd", "sh", "dmg"]
  const audioExtensions = ["mp3", "flac", "wav", "aac", "ogg", "m4a"]

  if (videoExtensions.includes(ext))
    return "from-blue-500 to-blue-400"
  if (imageExtensions.includes(ext))
    return "from-pink-500 to-pink-400"
  if (archiveExtensions.includes(ext))
    return "from-amber-500 to-amber-400"
  if (executableExtensions.includes(ext))
    return "from-rose-500 to-rose-400"
  if (audioExtensions.includes(ext))
    return "from-emerald-500 to-emerald-400"
  return "from-zinc-500 to-zinc-400"
}

export default function StatsDashboard({
  files,
}: Props) {
  const stats = getTorrentStats(files)
  const entries = Object.entries(stats)
  const total = entries.reduce(
    (sum, [, count]) => sum + count,
    0
  )

  if (entries.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.02] py-12 text-center">
        <BarChart3 className="h-8 w-8 text-zinc-700" />
        <p className="text-sm text-zinc-600">
          No file statistics available
        </p>
      </div>
    )
  }

  return (
    <div className="mt-10">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-500/25 bg-violet-500/10">
            <BarChart3 className="h-4 w-4 text-violet-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              File Statistics
            </h2>
            <p className="text-xs text-zinc-600">
              Distribution by type
            </p>
          </div>
        </div>

        <div className="rounded-full border border-white/8 bg-white/4 px-3 py-1">
          <span className="section-label text-zinc-500">
            {total} total files
          </span>
        </div>
      </div>

      {/* Stat cards grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {entries.map(([extension, count], idx) => {
          const cfg = getStatConfig(extension)
          const pct = Math.round((count / total) * 100)
          const progressColor = getProgressColor(extension)

          return (
            <div
              key={extension}
              className={`stat-card ${cfg.glow}`}
              style={{
                "--card-glow": cfg.bg.replace(
                  "bg-",
                  "rgba("
                ),
                animationDelay: `${idx * 0.08}s`,
              } as React.CSSProperties}
            >
              {/* Icon + count row */}
              <div className="mb-4 flex items-start justify-between">
                <div
                  className={`
                    flex h-9 w-9 items-center justify-center
                    rounded-xl border ${cfg.border} ${cfg.bg}
                    ${cfg.color}
                  `}
                >
                  {cfg.icon}
                </div>

                <div className="text-right">
                  <span className={`count-scale font-syne text-3xl font-extrabold ${cfg.color}`}>
                    {count}
                  </span>
                </div>
              </div>

              {/* Label */}
              <div className="mb-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  .{extension}
                </p>
                <p className="text-[10px] text-zinc-600">
                  {cfg.label}
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-[10px] text-zinc-700">
                    Share
                  </span>
                  <span className="mono text-[10px] text-zinc-500">
                    {pct}%
                  </span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className={`bar-fill h-full rounded-full bg-gradient-to-r ${progressColor}`}
                    style={{
                      "--target-width": `${pct}%`,
                      width: `${pct}%`,
                    } as React.CSSProperties}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}