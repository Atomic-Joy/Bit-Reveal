"use client"

import {
  Loader2,
  Upload,
} from "lucide-react"

import {
  useCallback,
  useMemo,
  useState,
} from "react"

import { useDropzone } from "react-dropzone"

import { TorrentMetadata } from "@/types/torrent"

import MetadataPanel from "@/components/stats/MetadataPanel"
import StatsDashboard from "@/components/stats/StatsDashboard"
import FileTree from "@/components/explorer/FileTree"

export default function UploadBox() {
  const [metadata, setMetadata] =
    useState<TorrentMetadata | null>(null)

  const [loading, setLoading] =
    useState(false)

  const [search, setSearch] =
    useState("")

  const [error, setError] =
    useState("")

  const filteredFiles = useMemo(() => {
    if (!metadata) return []

    return metadata.files.filter((file) =>
      file.name
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [metadata, search])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]

      if (!file) return

      if (!file.name.endsWith(".torrent")) {
        setError(
          "Please upload a valid .torrent file"
        )
        return
      }

      try {
        setLoading(true)

        setError("")

        const formData = new FormData()

        formData.append("file", file)

        const response = await fetch(
          "/api/parse",
          {
            method: "POST",
            body: formData,
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error)
        }

        setMetadata(data)
      } catch (error) {
        console.error(
          "Failed to parse torrent:",
          error
        )

        setError(
          "Failed to parse torrent file"
        )
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    multiple: false,
  })

  return (
    <div>
      <div
        {...getRootProps()}
        className={`
          relative overflow-hidden
          flex cursor-pointer flex-col items-center justify-center
          rounded-3xl border border-white/10
          bg-white/5 backdrop-blur-xl
          p-16 text-center
          shadow-2xl transition-all duration-300
          hover:border-blue-500/50 hover:bg-white/10
          ${
            isDragActive
              ? "scale-[1.02] border-blue-500 bg-blue-500/10"
              : ""
          }
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />

        <input {...getInputProps()} />

        <div className="relative z-10">
          {loading ? (
            <Loader2 className="mb-4 h-14 w-14 animate-spin text-blue-400" />
          ) : (
            <Upload className="mb-4 h-14 w-14 text-zinc-400" />
          )}

          <h2 className="text-2xl font-semibold">
            {loading
              ? "Parsing Torrent..."
              : "Upload Torrent File"}
          </h2>

          <p className="mt-2 text-zinc-400">
            Drag & drop your .torrent
            file here
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            or click to browse
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      {metadata && (
        <>
          <MetadataPanel metadata={metadata} />

          <div className="mt-8">
            <input
              type="text"
              placeholder="Search files..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                w-full rounded-2xl border border-white/10
                bg-white/5 px-5 py-4 text-white
                backdrop-blur-xl outline-none
                transition-all
                placeholder:text-zinc-500
                focus:border-blue-500
              "
            />
          </div>

          <StatsDashboard
            files={filteredFiles}
          />

          <FileTree files={filteredFiles} />
        </>
      )}
    </div>
  )
}