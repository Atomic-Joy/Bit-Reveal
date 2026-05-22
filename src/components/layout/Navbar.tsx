export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            BitReveal
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Torrent Intelligence Platform
          </p>
        </div>

        {/* <div className="hidden items-center gap-8 md:flex">
          <button className="text-sm text-zinc-400 transition hover:text-white">
            Analyzer
          </button>

          <button className="text-sm text-zinc-400 transition hover:text-white">
            Statistics
          </button>

          <button className="text-sm text-zinc-400 transition hover:text-white">
            Security
          </button>
        </div> */}
      </div>
    </nav>
  )
}