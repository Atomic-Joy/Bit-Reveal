export default function Navbar() {
  return (
    <nav className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-white">
          BitReveal
        </h1>

        <p className="text-sm text-zinc-400">
          Torrent Metadata Analyzer
        </p>
      </div>
    </nav>
  )
}