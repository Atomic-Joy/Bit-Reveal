import Navbar from "@/components/layout/Navbar"
import UploadBox from "@/components/upload/UploadBox"

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 py-10">
        <UploadBox />
      </section>
    </main>
  )
}