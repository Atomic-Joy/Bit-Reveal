import {
  FileArchive,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  ShieldAlert,
} from "lucide-react"

import { TorrentFile } from "@/types/torrent"

import { formatBytes } from "@/utils/formatBytes"
import { getFileType } from "@/utils/getFileType"

interface Props {
  files: TorrentFile[]
}

function getFileIcon(type: string) {
  switch (type) {
    case "video":
      return (
        <FileVideo className="h-5 w-5 text-blue-400" />
      )

    case "image":
      return (
        <FileImage className="h-5 w-5 text-pink-400" />
      )

    case "archive":
      return (
        <FileArchive className="h-5 w-5 text-yellow-400" />
      )

    case "audio":
      return (
        <FileAudio className="h-5 w-5 text-green-400" />
      )

    case "executable":
      return (
        <ShieldAlert className="h-5 w-5 text-red-400" />
      )

    default:
      return (
        <FileText className="h-5 w-5 text-zinc-400" />
      )
  }
}

export default function FileTree({
  files,
}: Props) {
  if (files.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-400">
        No files found.
      </div>
    )
  }

  return (
    <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="mb-6 text-2xl font-bold">
        Files
      </h2>

      <div className="space-y-3">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-xl bg-zinc-800 p-4"
          >
            <div className="flex items-center gap-3">
              {getFileIcon(
                getFileType(file.name)
              )}

              <div>
                <p className="font-medium">
                  {file.name}
                </p>

                <p className="text-sm text-zinc-500">
                  {file.path}
                </p>

                <span className="mt-1 inline-block rounded-lg bg-zinc-700 px-2 py-1 text-xs text-zinc-300">
                  {getFileType(file.name)}
                </span>
              </div>
            </div>

            <p className="text-sm text-zinc-400">
              {formatBytes(file.length)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}