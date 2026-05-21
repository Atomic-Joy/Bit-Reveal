import Navbar from "@/components/layout/Navbar"
import UploadBox from "@/components/upload/UploadBox"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_40%)]" />

      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <UploadBox />
      </section>
    </main>
  )
}