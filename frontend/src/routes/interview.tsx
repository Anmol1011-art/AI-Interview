import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { Send, Loader2, BrainCircuit } from "lucide-react"

type Message = {
  role: "ai" | "candidate"
  content: string
}

type InterviewResponse = {
  reply: string
  done: boolean
  evaluation?: unknown
}

export const Route = createFileRoute("/interview")({
  validateSearch: (search: Record<string, unknown>) => ({
    candidate: String(search.candidate ?? ""),
  }),
  component: Interview,
})

function Interview() {
  const { candidate } = Route.useSearch()
const navigate = useNavigate()

  const [sessionId] = useState(
    () => `session-${Date.now()}`
  )

  const [messages, setMessages] = useState<Message[]>([])
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [questionNumber, setQuestionNumber] = useState(1)

  const apiUrl = ""

  useEffect(() => {
    startInterview()
  }, [])

  async function startInterview() {
    try {
      setLoading(true)

      const response = await fetch(`${apiUrl}/api/interview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          candidateId: candidate,
          message: null,
        }),
      })

      const data: InterviewResponse = await response.json()

      setMessages([
        {
          role: "ai",
          content: data.reply,
        },
      ])
    } catch {
      setMessages([
        {
          role: "ai",
          content:
            "Unable to connect to the interview backend.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  async function submitAnswer() {
    if (!answer.trim() || submitting || done) return

    const currentAnswer = answer.trim()

    setMessages((previous) => [
      ...previous,
      {
        role: "candidate",
        content: currentAnswer,
      },
    ])

    setAnswer("")
    setSubmitting(true)

    try {
      const response = await fetch(`${apiUrl}/api/interview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          candidateId: candidate,
          message: currentAnswer,
        }),
      })

      const data: InterviewResponse = await response.json()

      setMessages((previous) => [
        ...previous,
        {
          role: "ai",
          content: data.reply,
        },
      ])

      if (data.done) {
        setDone(true)

    if (data.evaluation) {
      sessionStorage.setItem(
        `interview-evaluation-${sessionId}`,
        JSON.stringify(data.evaluation)
      )
    }

    navigate({
      to: "/results",
      search: {
        sessionId,
      },
    })
      } else {
        setQuestionNumber((number) => number + 1)
      }
    } catch {
      setMessages((previous) => [
        ...previous,
        {
          role: "ai",
          content:
            "Something went wrong while processing your answer.",
        },
      ])
    } finally {
      setSubmitting(false)
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault()
      submitAnswer()
    }
  }

  return (
    <main className="min-h-screen px-4 pb-10 pt-28 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1fr_320px]">

        {/* Interview */}
        <section className="glass flex min-h-[calc(100vh-150px)] flex-col rounded-2xl">

          {/* Header */}
          <header className="border-b border-white/10 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="mono-label text-[var(--primary-glow)]">
                  PROBEX AI
                </div>

                <h1 className="mt-2 text-xl font-semibold">
                  Technical Interview
                </h1>
              </div>

              <div className="text-right">
                <div className="mono text-xs text-white/40">
                  SESSION ACTIVE
                </div>

                <div className="mt-1 text-sm text-white/70">
                  Candidate {candidate}
                </div>
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex justify-between text-xs text-white/35">
                <span>Interview Progress</span>
                <span>{questionNumber} / 8</span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[var(--primary)] transition-all"
                  style={{
                    width: `${Math.min(
                      (questionNumber / 8) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </header>

          {/* Conversation */}
          <div className="flex-1 space-y-5 overflow-y-auto p-5">
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.role === "candidate"
                    ? "ml-auto max-w-2xl"
                    : "max-w-3xl"
                }
              >
                <div className="mono-label mb-2 text-white/30">
                  {message.role === "ai"
                    ? "PROBEX AI"
                    : "YOU"}
                </div>

                <div
                  className={
                    message.role === "candidate"
                      ? "rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-white/75"
                      : "rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary)]/[0.06] p-5 text-white/80"
                  }
                >
                  {message.content}
                </div>
              </div>
            ))}

            {(loading || submitting) && (
              <div className="flex items-center gap-3 text-sm text-white/40">
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                {loading
                  ? "Starting interview..."
                  : "Analyzing response..."}
              </div>
            )}
          </div>

          {/* Input */}
          {!done && (
            <div className="border-t border-white/10 p-5">
              <textarea
                value={answer}
                onChange={(event) =>
                  setAnswer(event.target.value)
                }
                onKeyDown={handleKeyDown}
                disabled={submitting || loading}
                placeholder="Explain your approach..."
                className="min-h-32 w-full resize-none rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[var(--primary)]"
              />

              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-xs text-white/25">
                  Ctrl/Cmd + Enter to submit
                </span>

                <button
                  onClick={submitAnswer}
                  disabled={
                    !answer.trim() ||
                    submitting ||
                    loading
                  }
                  className="inline-flex items-center rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold transition hover:bg-[var(--primary-glow)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Submit Answer
                  <Send className="ml-2" size={16} />
                </button>
              </div>
            </div>
          )}

          {done && (
            <div className="border-t border-white/10 p-5 text-center">
              <div className="text-lg font-semibold">
                Interview Completed
              </div>

              <p className="mt-2 text-sm text-white/40">
                Your responses have been evaluated.
              </p>
            </div>
          )}
        </section>

        {/* Interview Intelligence */}
        <aside className="glass h-fit rounded-2xl p-5">
          <div className="flex items-center gap-2">
            <BrainCircuit
              size={18}
              className="text-[var(--primary-glow)]"
            />

            <h2 className="mono text-sm">
              INTERVIEW INTELLIGENCE
            </h2>
          </div>

          <div className="mt-7">
            <div className="mono-label text-white/30">
              INTERVIEW PROGRESS
            </div>

            <div className="mt-2 text-2xl font-semibold">
              {questionNumber} / 8
            </div>
          </div>

          <div className="mt-7">
            <div className="mono-label text-white/30">
              CURRICULUM FLOW
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "RAG",
                "Vector Search",
                "Prompting",
                "Agents",
                "MCP",
                "Deployment",
                "Production",
              ].map((topic, index) => (
                <span
                  key={topic}
                  className={`rounded-full border px-2.5 py-1 text-[11px] ${
                    index < questionNumber
                      ? "border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--primary-glow)]"
                      : "border-white/10 text-white/25"
                  }`}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-7">
            <div className="mono-label text-white/30">
              CURRENT DEPTH
            </div>

            <div className="mt-3 rounded-xl border border-[var(--gold)]/20 bg-[var(--gold)]/5 p-4">
              <div className="mono text-sm text-[var(--gold)]">
                ADAPTIVE
              </div>

              <p className="mt-2 text-xs leading-5 text-white/40">
                Question difficulty is determined from the
                interview context.
              </p>
            </div>
          </div>

          <div className="mt-7 border-t border-white/10 pt-5">
            <div className="mono-label text-white/25">
              WHY THIS QUESTION?
            </div>

            <p className="mt-3 text-xs leading-5 text-white/35">
              PROBEX uses previous responses and curriculum
              context to determine the next question.
            </p>
          </div>
        </aside>
      </div>
    </main>
  )
}
