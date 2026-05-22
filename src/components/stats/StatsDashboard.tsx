import {
  FileArchive,
  FileCode,
  FileImage,
  FileVideo,
  ShieldAlert,
} from "lucide-react"

import { TorrentFile } from "@/types/torrent"

import { getTorrentStats } from "@/utils/getTorrentStats"

interface Props {
  files: TorrentFile[]
}

function getExtensionIcon(ext: string) {
  const videoExtensions = [
    "mp4",
    "mkv",
    "avi",
    "mov",
  ]

  const imageExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
  ]

  const archiveExtensions = [
    "zip",
    "rar",
    "7z",
    "tar",
    "gz",
  ]

  const executableExtensions = [
    "exe",
    "bat",
    "msi",
    "cmd",
  ]

  if (videoExtensions.includes(ext)) {
    return (
      <FileVideo className="h-6 w-6 text-blue-400" />
    )
  }

  if (imageExtensions.includes(ext)) {
    return (
      <FileImage className="h-6 w-6 text-pink-400" />
    )
  }

  if (archiveExtensions.includes(ext)) {
    return (
      <FileArchive className="h-6 w-6 text-yellow-400" />
    )
  }

  if (
    executableExtensions.includes(ext)
  ) {
    return (
      <ShieldAlert className="h-6 w-6 text-red-400" />
    )
  }

  return (
    <FileCode className="h-6 w-6 text-zinc-400" />
  )
}

export default function StatsDashboard({
  files,
}: Props) {
  const stats = getTorrentStats(files)

  return (
    <div className="mt-8">
      <h2 className="mb-6 text-2xl font-bold">
        File Statistics
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(stats).map(
          ([extension, count]) => (
            <div
              key={extension}
              className="
                rounded-2xl border border-white/10
                bg-white/5 p-6 backdrop-blur-xl
                shadow-xl transition-all
                hover:bg-white/10
              "
            >
              <div className="flex items-center justify-between">
                {getExtensionIcon(extension)}

                <span className="text-3xl font-bold">
                  {count}
                </span>
              </div>

              <p className="mt-4 text-zinc-400 uppercase">
                .{extension}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  )
}