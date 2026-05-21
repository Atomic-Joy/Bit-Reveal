import { TorrentFile } from "@/types/torrent"
import { getFileType } from "./getFileType"

export function getTorrentStats(
  files: TorrentFile[]
) {
  const stats = {
    video: 0,
    image: 0,
    archive: 0,
    audio: 0,
    executable: 0,
    other: 0,
  }

  files.forEach((file) => {
    const type = getFileType(file.name)

    stats[type as keyof typeof stats]++
  })

  return stats
}