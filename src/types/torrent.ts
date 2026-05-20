export interface TorrentFile {
  name: string
  path: string
  length: number
}

export interface TorrentMetadata {
  name: string
  size: number
  files: TorrentFile[]
  infoHash: string
  created?: string
  comment?: string
}