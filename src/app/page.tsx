"use client"

import { useState, useMemo } from "react"
import Navbar from "@/components/layout/Navbar"
import UploadBox from "@/components/upload/UploadBox"
import MetadataPanel from "@/components/stats/MetadataPanel"
import StatsDashboard from "@/components/stats/StatsDashboard"
import FileTree from "@/components/explorer/FileTree"
import StatisticsPanel from "@/components/stats/StatisticsPanel"
import { TorrentMetadata } from "@/types/torrent"
import { X, ArrowRight, BarChart3, FolderOpen } from "lucide-react"

export default function Home() {
  const [metadata, setMetadata] = useState<TorrentMetadata | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fileName, setFileName] = useState("")
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<"analyzer" | "statistics">("analyzer")

  const filteredFiles = useMemo(() => {
    if (!metadata) return []

    return metadata.files.filter((file) =>
      file.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [metadata, search])

  const handleReset = () => {
    setMetadata(null)
    setFileName("")
    setError("")
    setSearch("")
    setActiveTab("analyzer")
  }

  const handleSetMetadata = (data: TorrentMetadata | null) => {
    setMetadata(data)
    if (data) {
      setActiveTab("analyzer") // auto switch to analyzer on upload
    }
  }

  return (
    <>
      {/* Aurora background orbs */}
      <div className="aurora-bg">
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
        <div className="aurora-orb aurora-orb-3" />
      </div>

      {/* Noise grain overlay */}
      <div className="grain-overlay" />

      <main className="relative min-h-screen overflow-hidden text-white">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hasMetadata={!!metadata}
        />

        {/* Hero Section */}
        <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-16">
          {/* Dot grid behind hero */}
          <div className="pointer-events-none absolute inset-0 dot-grid opacity-40" />

          {/* Two-column layout for Hero info & Dropzone */}
          <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            
            {/* Left Column: Brand & Hero Info */}
            <div className="lg:col-span-7">
              {/* Badge */}
              <div className="fade-up fade-up-1 mb-6 inline-flex items-center gap-2.5">
                <div className="relative flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                  </span>
                  <span className="section-label text-blue-400/80">
                    Torrent Intelligence Platform
                  </span>
                </div>
              </div>

              {/* Main headline */}
              <div className="fade-up fade-up-2">
                <h1
                  className="font-syne text-[clamp(2.5rem,5.5vw,4.8rem)] font-extrabold leading-[1.05] tracking-tight"
                >
                  <span className="gradient-text">
                    Decode every
                  </span>
                  <br />
                  <span className="text-white/95">
                    torrent with
                  </span>
                  <br />
                  <span className="gradient-text-blue">
                    precision.
                  </span>
                </h1>
              </div>

              {/* Subheadline */}
              <p className="fade-up fade-up-3 mt-6 text-base leading-relaxed text-zinc-400 md:text-lg">
                BitReveal transforms raw{" "}
                <span className="text-white/80">.torrent files</span> into
                structured intelligence — inspect file hierarchies,
                detect suspicious content, and visualize metadata
                through a precision-engineered dashboard.
              </p>

              {/* Stat pills */}
              <div className="fade-up fade-up-4 mt-8 flex flex-wrap items-center gap-3">
                {[
                  { label: "File Types", value: "8+" },
                  { label: "Metadata Fields", value: "12+" },
                  { label: "Parse Time", value: "<1s" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center gap-2.5 rounded-full border border-white/8 bg-white/4 px-4 py-1.5"
                  >
                    <span className="font-syne text-sm font-bold gradient-text-cyan">
                      {stat.value}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Upload Box */}
            <div className="fade-up fade-up-5 lg:col-span-5">
              <div className="mb-4 flex items-center gap-4">
                <span className="section-label">
                  01 — Drop your file
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
              </div>

              <UploadBox
                metadata={metadata}
                setMetadata={handleSetMetadata}
                loading={loading}
                setLoading={setLoading}
                error={error}
                setError={setError}
                fileName={fileName}
                setFileName={setFileName}
              />
            </div>
          </div>

          {/* Results section rendered below the fold */}
          {metadata && (
            <div className="fade-up">
              {/* Section divider */}
              <div id="results-anchor" className="scroll-mt-24 my-12 flex items-center gap-4">
                <span className="section-label">
                  02 — {activeTab === "analyzer" ? "Analysis Results" : "Diagnostic Statistics"}
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/4 px-3 py-1.5 text-xs text-zinc-500 transition-all hover:border-white/15 hover:text-white"
                >
                  <X className="h-3 w-3" />
                  Reset
                </button>
              </div>

              {activeTab === "analyzer" ? (
                <>
                  <MetadataPanel metadata={metadata} />

                  {/* Search bar — terminal style */}
                  <div className="mt-12 flex items-center gap-4">
                    <span className="section-label">
                      03 — File Explorer
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                  </div>

                  <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3 backdrop-blur-xl transition-all focus-within:border-blue-500/50 focus-within:bg-white/[0.04]">
                    <span className="mono text-sm font-medium text-blue-500">
                      &gt;
                    </span>
                    <input
                      type="text"
                      placeholder="search files..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="mono w-full bg-transparent text-sm text-zinc-300 outline-none placeholder:text-zinc-600"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="text-zinc-600 hover:text-zinc-400 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <StatsDashboard files={filteredFiles} />

                  <FileTree files={filteredFiles} />

                  {/* End of Page Navigation: Analyzer -> Statistics */}
                  <div className="mt-12 rounded-2xl border border-white/5 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 p-6 backdrop-blur-xl hover:border-blue-500/20 transition-all group">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                          <BarChart3 className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-syne text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                            Deep-Dive Statistics & Diagnostics
                          </h3>
                          <p className="text-sm text-zinc-400 mt-1">
                            Analyze security threat levels, storage composition, trackers, and download speeds.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab("statistics")
                          setTimeout(() => {
                            const el = document.getElementById("results-anchor")
                            if (el) el.scrollIntoView({ behavior: "smooth" })
                          }, 50)
                        }}
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 hover:shadow-blue-500/40 transition-all cursor-pointer group-hover:translate-x-1 duration-200 w-full sm:w-auto justify-center"
                      >
                        <span>View Stats Dashboard</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <StatisticsPanel metadata={metadata} />

                  {/* End of Page Navigation: Statistics -> Analyzer */}
                  <div className="mt-12 rounded-2xl border border-white/5 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 p-6 backdrop-blur-xl hover:border-emerald-500/20 transition-all group">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                          <FolderOpen className="h-6 w-6 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="font-syne text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                            Torrent Content Analyzer
                          </h3>
                          <p className="text-sm text-zinc-400 mt-1">
                            Inspect files, use terminal search, explore folder structures, and check size parameters.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab("analyzer")
                          setTimeout(() => {
                            const el = document.getElementById("results-anchor")
                            if (el) el.scrollIntoView({ behavior: "smooth" })
                          }, 50)
                        }}
                        className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-500 hover:shadow-emerald-500/40 transition-all cursor-pointer group-hover:translate-x-1 duration-200 w-full sm:w-auto justify-center"
                      >
                        <span>Return to Analyzer</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
              {/* Bottom Navigation Toggle */}
              <div className="mt-12 flex justify-center border-t border-white/5 pt-8">
                <div className="flex items-center gap-1.5 rounded-xl border border-white/8 bg-white/[0.02] p-1.5 backdrop-blur-xl">
                  <button
                    onClick={() => {
                      setActiveTab("analyzer")
                      // Smooth scroll to the results title anchor
                      const el = document.getElementById("results-anchor")
                      if (el) el.scrollIntoView({ behavior: "smooth" })
                    }}
                    className={`
                      cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all
                      ${activeTab === "analyzer"
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                        : "text-zinc-500 hover:text-zinc-300"
                      }
                    `}
                  >
                    Analyzer
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("statistics")
                      // Smooth scroll to the results title anchor
                      const el = document.getElementById("results-anchor")
                      if (el) el.scrollIntoView({ behavior: "smooth" })
                    }}
                    className={`
                      cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all
                      ${activeTab === "statistics"
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                        : "text-zinc-500 hover:text-zinc-300"
                      }
                    `}
                  >
                    Statistics
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Bottom gradient fade */}
        <div className="pointer-events-none fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#08090c] to-transparent" />
      </main>
    </>
  )
}