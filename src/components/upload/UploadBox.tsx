"use client"

import {
  CheckCircle2,
  CloudUpload,
  File,
  Loader2,
  TriangleAlert,
  X,
} from "lucide-react"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { TorrentMetadata } from "@/types/torrent"

interface UploadBoxProps {
  metadata: TorrentMetadata | null
  setMetadata: (metadata: TorrentMetadata | null) => void
  loading: boolean
  setLoading: (loading: boolean) => void
  error: string
  setError: (error: string) => void
  fileName: string
  setFileName: (fileName: string) => void
}

export default function UploadBox({
  metadata,
  setMetadata,
  loading,
  setLoading,
  error,
  setError,
  fileName,
  setFileName,
}: UploadBoxProps) {

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]

      if (!file) return

      if (!file.name.endsWith(".torrent")) {
        setError("Please upload a valid .torrent file")
        return
      }

      try {
        setLoading(true)
        setError("")
        setFileName(file.name)

        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/parse", {
          method: "POST",
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error)
        }

        setMetadata(data)
      } catch (error) {
        console.error("Failed to parse torrent:", error)
        setError("Failed to parse torrent file. Please check the file and try again.")
      } finally {
        setLoading(false)
      }
    },
    [setError, setFileName, setLoading, setMetadata]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  })

  return (
    <div>
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          group relative overflow-hidden cursor-pointer
          rounded-2xl border transition-all duration-500
          ${isDragActive
            ? "border-blue-500/80 bg-blue-500/10 scale-[1.01]"
            : metadata
              ? "border-emerald-500/40 bg-emerald-500/5"
              : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.04]"
          }
        `}
        style={{ minHeight: "380px" }}
      >
        <input {...getInputProps()} />

        {/* Animated gradient background */}
        <div className={`
          absolute inset-0 transition-opacity duration-500
          bg-gradient-to-br from-blue-500/8 via-transparent to-violet-500/8
          ${isDragActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
        `} />

        {/* SVG dashed ring spinner */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <svg
            className={`absolute h-full w-full transition-opacity duration-300 ${
              isDragActive ? "opacity-40" : "opacity-0 group-hover:opacity-20"
            }`}
            viewBox="0 0 100 100"
            fill="none"
          >
            <rect
              x="1.5" y="1.5" width="97" height="97"
              rx="14" ry="14"
              stroke="url(#dashGrad)"
              strokeWidth="0.5"
              strokeDasharray="6 4"
              className="dash-spin"
              style={{ transformOrigin: "50px 50px" }}
            />
            <defs>
              <linearGradient id="dashGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Main content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 text-center">
          {loading ? (
            /* Loading state */
            <div className="flex flex-col items-center gap-5">
              <div className="relative flex h-20 w-20 items-center justify-center">
                {/* Orbital ring */}
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-violet-500 spin-gradient opacity-80" />
                <div className="absolute inset-2.5 rounded-full border border-blue-500/20" />
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              </div>
              <div>
                <p className="text-xl font-semibold text-white">
                  Parsing torrent...
                </p>
                <p className="mt-1.5 text-sm text-zinc-500">
                  Decoding metadata structure
                </p>
              </div>
            </div>
          ) : metadata ? (
            /* Success state */
            <div className="flex flex-col items-center gap-4">
              <div className="relative flex h-18 w-18 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
                <CheckCircle2 className="h-9 w-9 text-emerald-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">
                  Analysis complete
                </p>
                <div className="mt-3 flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
                  <File className="h-3.5 w-3.5 text-zinc-500" />
                  <span className="mono text-xs text-zinc-400">
                    {fileName}
                  </span>
                </div>
              </div>
              <p className="text-xs text-zinc-600">
                Drop another file to replace
              </p>
            </div>
          ) : isDragActive ? (
            /* Drag active state */
            <div className="flex flex-col items-center gap-5">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-blue-500/20 ping-slow" />
                <div className="absolute inset-0 rounded-full bg-blue-500/10 ping-medium" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-blue-500/40 bg-blue-500/15">
                  <CloudUpload className="h-9 w-9 text-blue-400" />
                </div>
              </div>
              <div>
                <p className="text-xl font-semibold text-white">
                  Release to analyze
                </p>
                <p className="mt-1.5 text-sm text-blue-400/70">
                  Drop your .torrent file here
                </p>
              </div>
            </div>
          ) : (
            /* Idle state */
            <div className="flex flex-col items-center gap-6">
              <div className="relative float-animate">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 group-hover:border-blue-500/30 group-hover:bg-blue-500/8 transition-all duration-300">
                  <CloudUpload className="h-9 w-9 text-zinc-500 transition-colors duration-300 group-hover:text-blue-400" />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xl font-semibold text-white">
                  Drop your torrent file
                </p>
                <p className="text-sm text-zinc-500">
                  Drag & drop or{" "}
                  <span className="text-blue-400 underline underline-offset-2 decoration-blue-400/40">
                    browse files
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-px w-12 bg-white/10" />
                <span className="mono text-xs text-zinc-600">
                  .torrent files only
                </span>
                <div className="h-px w-12 bg-white/10" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="shake mt-4 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/8 p-4 glow-rose">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
          <p className="text-sm text-rose-300">{error}</p>
          <button
            onClick={() => setError("")}
            className="ml-auto shrink-0 text-rose-500 hover:text-rose-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}