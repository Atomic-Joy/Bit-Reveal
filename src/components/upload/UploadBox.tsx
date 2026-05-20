"use client"

import { Upload } from "lucide-react"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"

import { TorrentMetadata } from "@/types/torrent"

import MetadataPanel from "@/components/stats/MetadataPanel"
import FileTree from "@/components/explorer/FileTree"

export default function UploadBox() {
  const [metadata, setMetadata] =
    useState<TorrentMetadata | null>(null)

  const [loading, setLoading] =
    useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]

      if (!file) return

      if (!file.name.endsWith(".torrent")) {
        alert("Please upload a .torrent file")
        return
      }

      try {
        setLoading(true)

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

        alert("Failed to parse torrent file")
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
          flex cursor-pointer flex-col items-center justify-center
          rounded-2xl border-2 border-dashed p-16 text-center
          transition-all duration-300
          ${
            isDragActive
              ? "border-blue-500 bg-blue-500/10"
              : "border-zinc-700 bg-zinc-900 hover:border-zinc-500"
          }
        `}
      >
        <input {...getInputProps()} />

        <Upload className="mb-4 h-14 w-14 text-zinc-400" />

        <h2 className="text-2xl font-semibold">
          {loading
            ? "Parsing Torrent..."
            : "Upload Torrent File"}
        </h2>

        <p className="mt-2 text-zinc-400">
          Drag & drop your .torrent file here
        </p>

        <p className="mt-1 text-sm text-zinc-500">
          or click to browse
        </p>
      </div>

      {metadata && (
        <>
          <MetadataPanel metadata={metadata} />

          <FileTree files={metadata.files} />
        </>
      )}
    </div>
  )
}