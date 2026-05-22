import { TorrentFile } from "@/types/torrent"

export function getTorrentStats(
  files: TorrentFile[]
) {
  const stats: Record<string, number> = {}

  files.forEach((file) => {
    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "unknown"

    stats[extension] =
      (stats[extension] || 0) + 1
  })

  return stats
}