import {
  FileArchive,
  FileAudio,
  FileImage,
  FileVideo,
  ShieldAlert,
} from "lucide-react"

import { TorrentFile } from "@/types/torrent"
import { getTorrentStats } from "@/utils/getTorrentStats"

interface Props {
  files: TorrentFile[]
}

export default function StatsDashboard({
  files,
}: Props) {
  const stats = getTorrentStats(files)

  const cards = [
    {
      label: "Videos",
      value: stats.video,
      icon: (
        <FileVideo className="h-6 w-6 text-blue-400" />
      ),
    },

    {
      label: "Images",
      value: stats.image,
      icon: (
        <FileImage className="h-6 w-6 text-pink-400" />
      ),
    },

    {
      label: "Archives",
      value: stats.archive,
      icon: (
        <FileArchive className="h-6 w-6 text-yellow-400" />
      ),
    },

    {
      label: "Audio",
      value: stats.audio,
      icon: (
        <FileAudio className="h-6 w-6 text-green-400" />
      ),
    },

    {
      label: "Executables",
      value: stats.executable,
      icon: (
        <ShieldAlert className="h-6 w-6 text-red-400" />
      ),
    },
  ]

  return (
    <div className="mt-8">
      <h2 className="mb-6 text-2xl font-bold">
        File Statistics
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
          >
            <div className="flex items-center justify-between">
              {card.icon}

              <span className="text-3xl font-bold">
                {card.value}
              </span>
            </div>

            <p className="mt-4 text-zinc-400">
              {card.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}