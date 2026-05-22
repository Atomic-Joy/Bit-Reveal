import Navbar from "@/components/layout/Navbar"
import UploadBox from "@/components/upload/UploadBox"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <Navbar />

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-20">
        <div className="mb-20 max-w-3xl">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-blue-400">
            Torrent Intelligence
          </p>

          <h1 className="text-6xl font-bold leading-tight tracking-tight md:text-7xl">
            Analyze torrent metadata with clarity.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400">
            BitReveal helps inspect torrent
            structures, detect suspicious
            files, and visualize metadata
            through a modern intelligence
            dashboard.
          </p>
        </div>

        <UploadBox />
      </section>
    </main>
  )
}