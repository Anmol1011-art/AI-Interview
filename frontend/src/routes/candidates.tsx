import { createFileRoute, Link } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { ArrowRight, Loader2 } from "lucide-react"

type Candidate = {
  member?: {
    id?: string
    name?: string
    jobRole?: string
    yearsExperience?: number
    education?: string
    status?: string
  }
  missions?: {
    day: number
    title: string
    passed?: boolean
    skipped?: boolean
    attempts?: number
  }[]
  signals?: {
    commitDays?: number
    missionsCompleted?: number
    missionsFirstTry?: number
  }
}

export const Route = createFileRoute("/candidates")({
  component: Candidates,
})

function Candidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/candidates`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load candidates")
        return res.json()
      })
      .then((data) => {
        setCandidates(data)
        setLoading(false)
      })
      .catch(() => {
        setError("Unable to load candidates from backend.")
        setLoading(false)
      })
  }, [])

  return (
    <main className="min-h-screen px-6 pb-20 pt-32">
      <div className="mx-auto max-w-7xl">
        <div>
          <div className="mono-label text-[var(--primary-glow)]">
            STEP 1 OF 3 · CANDIDATE SELECTION
          </div>

          <h1 className="mt-4 text-4xl font-semibold sm:text-6xl">
            Choose Your Candidate
          </h1>

          <p className="mt-5 max-w-2xl text-white/50">
            Your interview will be personalized using your learning journey.
          </p>
        </div>

        {loading && (
          <div className="mt-10 flex items-center gap-3 text-white/50">
            <Loader2 className="animate-spin" size={20} />
            Loading candidates...
          </div>
        )}

        {error && (
          <div className="mt-10 rounded-xl border border-red-400/20 bg-red-400/5 p-5 text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {candidates.map((candidate) => {
              const id = candidate.member?.id ?? ""
              const name = candidate.member?.name ?? "Candidate"
              const level = candidate.member?.jobRole ?? "AI Engineer"

              const days = candidate.signals?.commitDays ?? 0

              const progress = Math.min(
                100,
                Math.round((days / 31) * 100)
              )

              const completedAreas =
                candidate.missions
                  ?.filter((mission) => mission.passed === true)
                  .map((mission) => mission.title) ?? []

              const focusAreas =
                candidate.missions
                  ?.filter(
                    (mission) =>
                      mission.passed !== true &&
                      mission.skipped !== true
                  )
                  .map((mission) => mission.title) ?? []

              return (
                <div
                  key={id}
                  className="glass glass-hover rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="mono-label text-white/30">
                        {id}
                      </div>

                      <h2 className="mt-2 text-xl font-semibold">
                        {name}
                      </h2>

                      <p className="mt-1 text-sm text-white/40">
                        {level}
                      </p>
                    </div>

                    <div className="mono text-xl text-[var(--primary-glow)]">
                      {progress}%
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="mb-2 flex justify-between text-xs text-white/35">
                      <span>Learning Progress</span>
                      <span>{days} / 31 Days</span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-[var(--primary)]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {completedAreas.length > 0 && (
                    <div className="mt-6">
                      <div className="mono-label text-white/25">
                        COMPLETED AREAS
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {completedAreas.map((area) => (
                          <span
                            key={area}
                            className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/55"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {focusAreas.length > 0 && (
                    <div className="mt-5">
                      <div className="mono-label text-white/25">
                        FOCUS AREAS
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {focusAreas.map((area) => (
                          <span
                            key={area}
                            className="rounded-full border border-[var(--gold)]/20 bg-[var(--gold)]/5 px-3 py-1 text-xs text-[var(--gold)]"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link
                    to="/interview"
                    search={{ candidate: id }}
                    className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold transition hover:-translate-y-0.5 hover:bg-[var(--primary-glow)]"
                  >
                    Start Interview
                    <ArrowRight className="ml-2" size={18} />
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
