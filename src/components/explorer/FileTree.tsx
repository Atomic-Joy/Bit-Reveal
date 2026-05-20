import { FileText } from "lucide-react"

import { TorrentFile } from "@/types/torrent"
import { formatBytes } from "@/utils/formatBytes"

interface Props {
  files: TorrentFile[]
}

export default function FileTree({
  files,
}: Props) {
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
              <FileText className="h-5 w-5 text-zinc-400" />

              <div>
                <p className="font-medium">
                  {file.name}
                </p>

                <p className="text-sm text-zinc-500">
                  {file.path}
                </p>
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