import { TorrentMetadata } from "@/types/torrent"
import { formatBytes } from "@/utils/formatBytes"

interface Props {
  metadata: TorrentMetadata
}

export default function MetadataPanel({
  metadata,
}: Props) {
  return (
    <div
      className="
        mt-8 rounded-3xl border border-white/10
        bg-white/5 p-6 backdrop-blur-xl
        shadow-2xl
      "
    >
      <h2 className="mb-6 text-2xl font-bold">
        Torrent Information
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div
          className="
            rounded-2xl border border-white/5
            bg-white/5 p-4 transition-all
            hover:bg-white/10
          "
        >
          <p className="text-sm text-zinc-400">
            Name
          </p>

          <p className="mt-1 font-medium">
            {metadata.name}
          </p>
        </div>

        <div
          className="
            rounded-2xl border border-white/5
            bg-white/5 p-4 transition-all
            hover:bg-white/10
          "
        >
          <p className="text-sm text-zinc-400">
            Total Size
          </p>

          <p className="mt-1 font-medium">
            {formatBytes(metadata.size)}
          </p>
        </div>

        <div
          className="
            rounded-2xl border border-white/5
            bg-white/5 p-4 transition-all
            hover:bg-white/10
          "
        >
          <p className="text-sm text-zinc-400">
            File Count
          </p>

          <p className="mt-1 font-medium">
            {metadata.files.length}
          </p>
        </div>

        <div
          className="
            rounded-2xl border border-white/5
            bg-white/5 p-4 transition-all
            hover:bg-white/10
          "
        >
          <p className="text-sm text-zinc-400">
            Info Hash
          </p>

          <p className="mt-1 break-all text-sm font-medium">
            {metadata.infoHash}
          </p>
        </div>
      </div>
    </div>
  )
}