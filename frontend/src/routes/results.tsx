import { createFileRoute, Link } from "@tanstack/react-router"
import { motion } from "framer-motion"
import {
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Target,
  TriangleAlert,
} from "lucide-react"

const scores = [
  ["Technical Knowledge", 86],
  ["Problem Solving", 79],
  ["Communication", 88],
  ["Practical Depth", 74],
]

const strengths = [
  ["RAG", "Strong understanding of retrieval and grounding concepts."],
  [
    "Prompt Engineering",
    "Communicates prompting strategies clearly.",
  ],
  [
    "Vector Search",
    "Understands embeddings and semantic retrieval.",
  ],
]

const gaps = [
  ["MCP", "Needs deeper understanding of tool interoperability."],
  [
    "Production AI",
    "Could improve knowledge of production failure handling.",
  ],
]

function ScoreRing({
  label,
  score,
}: {
  label: string
  score: number
}) {
  const circumference = 2 * Math.PI * 42
  const offset = circumference - (score / 100) * circumference

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="glass rounded-2xl p-5"
    >
      <div className="relative mx-auto h-32 w-32">
        <svg
          className="h-full w-full -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="currentColor"
            strokeWidth="7"
            className="text-white/10"
          />

          <motion.circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="currentColor"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-[var(--primary-glow)]"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="mono text-2xl font-bold">
            {score}
          </span>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-white/55">
        {label}
      </div>
    </motion.div>
  )
}

function ResultsPage() {
  return (
    <main className="min-h-screen px-6 pb-24 pt-32">
      <div className="hero-glow right-[-180px] top-[-100px]" />

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mono-label text-[var(--success)]">
            EVALUATION COMPLETE
          </div>

          <div className="mt-5 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
                Interview Complete
              </h1>

              <p className="mt-4 text-white/40">
                Strong Technical Readiness
              </p>
            </div>

            <div className="text-left md:text-right">
              <div className="mono text-6xl font-bold text-[var(--primary-glow)]">
                82
                <span className="text-2xl text-white/25">
                  {" "}
                  / 100
                </span>
              </div>

              <div className="mono-label mt-2 text-[var(--gold)]">
                STRONG TECHNICAL READINESS
              </div>
            </div>
          </div>
        </motion.div>

        {/* Score rings */}
        <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {scores.map(([label, score]) => (
            <ScoreRing
              key={label as string}
              label={label as string}
              score={score as number}
            />
          ))}
        </section>

        {/* Evidence */}
        <section className="mt-12">
          <div className="mono-label text-[var(--primary-glow)]">
            EVIDENCE COLLECTED
          </div>

          <div className="mt-5 glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Technical Knowledge
              </h2>

              <span className="mono text-2xl text-[var(--primary-glow)]">
                86
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                "Explained RAG architecture",
                "Described semantic retrieval",
                "Identified hallucination risk",
                "Proposed metadata filtering",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-white/55"
                >
                  <CheckCircle2
                    size={16}
                    className="shrink-0 text-[var(--success)]"
                  />
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-[var(--gold)]/20 bg-[var(--gold)]/5 p-4 text-sm text-white/50">
              <span className="text-[var(--gold)]">
                Potential gap:
              </span>{" "}
              Reranking strategy needs deeper understanding.
            </div>
          </div>
        </section>

        {/* Strengths + gaps */}
        <section className="mt-12 grid gap-5 lg:grid-cols-2">
          <div>
            <div className="mono-label text-[var(--success)]">
              STRONG AREAS
            </div>

            <div className="mt-5 space-y-3">
              {strengths.map(([title, text]) => (
                <div
                  key={title}
                  className="rounded-xl border-l-2 border-[var(--success)] bg-white/[0.025] p-5"
                >
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2
                      size={16}
                      className="text-[var(--success)]"
                    />
                    {title}
                  </div>

                  <p className="mt-2 text-sm leading-6 text-white/40">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mono-label text-[var(--gold)]">
              KNOWLEDGE GAPS
            </div>

            <div className="mt-5 space-y-3">
              {gaps.map(([title, text]) => (
                <div
                  key={title}
                  className="rounded-xl border-l-2 border-[var(--gold)] bg-white/[0.025] p-5"
                >
                  <div className="flex items-center gap-2 font-semibold">
                    <TriangleAlert
                      size={16}
                      className="text-[var(--gold)]"
                    />
                    {title}
                  </div>

                  <p className="mt-2 text-sm leading-6 text-white/40">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Curriculum */}
        <section className="mt-12 glass rounded-2xl p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mono-label text-[var(--primary-glow)]">
                CURRICULUM COVERAGE
              </div>

              <h2 className="mt-3 text-2xl font-semibold">
                6 / 8 areas assessed
              </h2>
            </div>

            <Target className="text-white/20" />
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Environment & Tooling", false],
              ["Data Foundations", true],
              ["Embeddings & Vector Search", true],
              ["LLM / Prompting", true],
              ["Chatbot Application", false],
              ["Agentic AI & MCP", true],
              ["Evaluation / Security", true],
              ["Production / Capstone", true],
            ].map(([topic, assessed]) => (
              <div
                key={topic as string}
                className="flex items-center gap-3 rounded-xl border border-white/10 p-4"
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    assessed
                      ? "bg-[var(--success)]"
                      : "bg-white/15"
                  }`}
                />

                <span className="text-sm text-white/50">
                  {topic as string}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Next moves */}
        <section className="mt-12">
          <div className="mono-label text-[var(--primary-glow)]">
            YOUR NEXT 3 MOVES
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              "Practice MCP architecture scenarios.",
              "Review production AI reliability patterns.",
              "Build and explain an MCP-based tool-calling architecture.",
            ].map((move, index) => (
              <div
                key={move}
                className="glass rounded-2xl p-6"
              >
                <span className="mono text-4xl font-bold text-white/10">
                  0{index + 1}
                </span>

                <p className="mt-6 text-sm leading-7 text-white/60">
                  {move}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Story */}
        <section className="mt-12">
          <div className="mono-label text-[var(--cyan)]">
            YOUR INTERVIEW STORY
          </div>

          <div className="mt-5 glass rounded-2xl p-6">
            <div className="grid gap-6 md:grid-cols-4">
              {[
                [
                  "Where you started",
                  "Strong foundation in RAG and vector search.",
                ],
                [
                  "What PROBEX discovered",
                  "You understand the concepts but need deeper production-level reasoning.",
                ],
                [
                  "Where you struggled",
                  "MCP interoperability scenarios.",
                ],
                [
                  "Your next move",
                  "Build and explain an MCP-based tool-calling architecture.",
                ],
              ].map(([title, text]) => (
                <div key={title}>
                  <div className="mono-label text-white/25">
                    {title}
                  </div>

                  <p className="mt-3 text-sm leading-6 text-white/55">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Replay */}
        <section className="mt-12">
          <div className="mono-label text-[var(--gold)]">
            INTERVIEW REPLAY
          </div>

          <div className="mt-5 glass rounded-2xl p-6">
            <div className="space-y-4">
              {[
                ["Q1", "Strong"],
                ["Q2", "Strong"],
                ["Q3", "Follow-up generated"],
                ["Q4", "Difficulty increased"],
                ["Q5", "Knowledge gap detected"],
                ["Q6", "Follow-up generated"],
              ].map(([question, status], index) => (
                <div
                  key={question}
                  className="flex items-center gap-4"
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                      index < 2
                        ? "border-[var(--success)]/30 bg-[var(--success)]/5"
                        : "border-[var(--primary)]/30 bg-[var(--primary)]/5"
                    }`}
                  >
                    <CheckCircle2 size={15} />
                  </div>

                  <div>
                    <div className="mono text-xs">
                      {question}
                    </div>

                    <div className="text-sm text-white/40">
                      {status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-14 rounded-3xl border border-white/10 bg-white/[0.025] p-8 text-center sm:p-14">
          <h2 className="text-3xl font-semibold sm:text-5xl">
            Interview deeper next time.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-white/40">
            Continue testing your understanding and discover where
            your technical reasoning can improve.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/candidates"
              className="inline-flex items-center rounded-xl bg-[var(--primary)] px-6 py-3.5 font-semibold"
            >
              <RotateCcw size={17} className="mr-2" />
              New Interview
            </Link>

            <Link
              to="/"
              className="inline-flex items-center rounded-xl border border-white/10 px-6 py-3.5 text-white/60"
            >
              Back Home
              <ArrowRight size={17} className="ml-2" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}

export const Route = createFileRoute("/results")({
  component: ResultsPage,
})