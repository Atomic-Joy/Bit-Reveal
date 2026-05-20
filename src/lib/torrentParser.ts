import parseTorrent from "parse-torrent"

import { TorrentMetadata } from "@/types/torrent"

export async function parseTorrentFile(
  file: File
): Promise<TorrentMetadata> {
  const arrayBuffer = await file.arrayBuffer()

  const parsed = await parseTorrent(
    new Uint8Array(arrayBuffer)
  )

  return {
    name: parsed.name || "Unknown",
    size: parsed.length || 0,
    infoHash: parsed.infoHash || "",
    created: parsed.created?.toString(),
    comment: (parsed as any).comment,

    files:
      parsed.files?.map((file) => ({
        name: file.name,
        path: file.path,
        length: file.length,
      })) || [],
  }
}