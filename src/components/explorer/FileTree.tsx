import {
  FileArchive,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  ShieldAlert,
  Folder,
} from "lucide-react"

import { TorrentFile } from "@/types/torrent"

import { formatBytes } from "@/utils/formatBytes"
import { getFileType } from "@/utils/getFileType"

interface Props {
  files: TorrentFile[]
}

interface FileBadgeConfig {
  label: string
  color: string
  bg: string
  border: string
  icon: React.ReactNode
}

function getFileBadgeConfig(type: string): FileBadgeConfig {
  switch (type) {
    case "video":
      return {
        label: "video",
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        icon: <FileVideo className="h-4 w-4 text-blue-400 shrink-0" />,
      }
    case "image":
      return {
        label: "image",
        color: "text-pink-400",
        bg: "bg-pink-500/10",
        border: "border-pink-500/20",
        icon: <FileImage className="h-4 w-4 text-pink-400 shrink-0" />,
      }
    case "archive":
      return {
        label: "archive",
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        icon: <FileArchive className="h-4 w-4 text-amber-400 shrink-0" />,
      }
    case "audio":
      return {
        label: "audio",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        icon: <FileAudio className="h-4 w-4 text-emerald-400 shrink-0" />,
      }
    case "executable":
      return {
        label: "exec",
        color: "text-rose-400",
        bg: "bg-rose-500/10",
        border: "border-rose-500/20",
        icon: <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0" />,
      }
    default:
      return {
        label: "file",
        color: "text-zinc-400",
        bg: "bg-zinc-500/10",
        border: "border-zinc-500/20",
        icon: <FileText className="h-4 w-4 text-zinc-400 shrink-0" />,
      }
  }
}

export default function FileTree({
  files,
}: Props) {
  if (files.length === 0) {
    return (
      <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.02] py-12 text-center">
        <Folder className="h-8 w-8 text-zinc-700" />
        <p className="text-sm text-zinc-600">
          No files found
        </p>
      </div>
    )
  }

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02]">
      {/* Table header */}
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-white/6 bg-white/[0.02] px-4 py-3 md:grid-cols-[2fr_auto_1fr_auto]">
        <span className="section-label">Name</span>
        <span className="section-label hidden md:block">Type</span>
        <span className="section-label hidden md:block">Path</span>
        <span className="section-label text-right">Size</span>
      </div>

      {/* File list — scrollable */}
      <div className="max-h-[520px] overflow-y-auto">
        {files.map((file, index) => {
          const type = getFileType(file.name)
          const cfg = getFileBadgeConfig(type)

          // Parse path segments for breadcrumb
          const pathParts = file.path
            ? file.path.split(/[/\\]/).filter(Boolean)
            : []

          return (
            <div
              key={index}
              className={`
                file-row grid grid-cols-[1fr_auto] gap-4 px-4 py-3
                md:grid-cols-[2fr_auto_1fr_auto]
                ${index % 2 === 0 ? "" : "bg-white/[0.015]"}
              `}
            >
              {/* File name + icon */}
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`
                    shrink-0 flex h-7 w-7 items-center justify-center
                    rounded-lg border ${cfg.border} ${cfg.bg}
                  `}
                >
                  {cfg.icon}
                </div>
                <span className="mono truncate text-sm font-medium text-white/90">
                  {file.name}
                </span>
              </div>

              {/* Type badge */}
              <div className="hidden items-center md:flex">
                <span
                  className={`
                    mono rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider
                    ${cfg.color} ${cfg.bg} ${cfg.border}
                  `}
                >
                  {cfg.label}
                </span>
              </div>

              {/* Path breadcrumb */}
              <div className="hidden min-w-0 items-center md:flex">
                {pathParts.length > 0 ? (
                  <div className="flex min-w-0 items-center gap-1">
                    {pathParts.map((part, i) => (
                      <span key={i} className="flex items-center gap-1 min-w-0">
                        {i > 0 && (
                          <span className="text-zinc-700 shrink-0">/</span>
                        )}
                        <span className="mono truncate text-xs text-zinc-600">
                          {part}
                        </span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="mono text-xs text-zinc-700">—</span>
                )}
              </div>

              {/* Size */}
              <div className="flex items-center justify-end">
                <span className="mono text-xs tabular-nums text-zinc-500">
                  {formatBytes(file.length)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-white/6 bg-white/[0.02] px-4 py-2.5">
        <span className="section-label text-zinc-700">
          {files.length} {files.length === 1 ? "file" : "files"} listed
        </span>
      </div>
    </div>
  )
}