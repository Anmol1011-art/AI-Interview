import { createFileRoute, Link } from "@tanstack/react-router"
import { motion } from "framer-motion"
import {
  ArrowRight,
  BrainCircuit,
  Crosshair,
  GitBranch,
  Layers3,
  MessageSquareText,
  Radar,
  ShieldCheck,
  Sparkles,
  Target,
  Workflow,
} from "lucide-react"
import { Header } from "#/components/Header"
import { Footer } from "#/components/Footer"

const stages = [
  ["01", "UNDERSTAND", "PROBEX studies the candidate's learning journey."],
  ["02", "INTERVIEW", "Questions are based on completed curriculum topics."],
  ["03", "PROBE", "Contextual follow-ups investigate the candidate's reasoning."],
  ["04", "ADAPT", "Difficulty and direction change based on understanding."],
]

const curriculum = [
  "Environment & Tooling",
  "Data Foundations",
  "Embeddings & Vector Search",
  "LLM / Prompting",
  "Chatbot Application",
  "Agentic AI & MCP",
  "Evaluation / Security",
  "Production / Capstone",
]

const features = [
  {
    title: "Adaptive Questioning",
    text: "Questions evolve from what the candidate actually demonstrates.",
    icon: GitBranch,
  },
  {
    title: "Candidate-Aware",
    text: "The interview follows the candidate's learning journey.",
    icon: Target,
  },
  {
    title: "Deep Follow-Ups",
    text: "Strong answers create opportunities for deeper technical probing.",
    icon: BrainCircuit,
  },
  {
    title: "Context Retention",
    text: "Previous answers remain part of the interview context.",
    icon: MessageSquareText,
  },
  {
    title: "Difficulty Engine",
    text: "Interview depth moves with demonstrated understanding.",
    icon: Workflow,
  },
  {
    title: "Evidence-Based Feedback",
    text: "Results connect assessment signals to observable answers.",
    icon: ShieldCheck,
  },
]

export const Route = createFileRoute("/")({ component: Home })

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[var(--background)]">
      <Header />

      <main>
        <section className="relative flex min-h-screen items-center grid-lines px-6 pt-32">
          <div className="hero-glow right-[-180px] top-[-80px]" />

          <div className="mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_.95fr]">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="mono-label mb-6 flex items-center gap-2 text-[var(--primary-glow)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--cyan)] shadow-[0_0_10px_var(--cyan)]" />
                Adaptive AI Interview Engine
              </div>

              <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
                The Interviewer That Thinks{" "}
                <span className="text-gradient">Beyond the Answer.</span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/55">
                Personalized technical interviews that adapt to your
                knowledge, challenge your reasoning, and reveal what you
                actually understand.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  to="/candidates"
                  className="group rounded-xl bg-[var(--primary)] px-6 py-3.5 font-semibold shadow-2xl shadow-indigo-950/50 transition hover:-translate-y-0.5 hover:bg-[var(--primary-glow)]"
                >
                  Start Interview
                  <ArrowRight
                    className="ml-2 inline transition-transform group-hover:translate-x-1"
                    size={18}
                  />
                </Link>

                <a
                  href="#how-it-works"
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 font-medium text-white/80 transition hover:bg-white/[0.07]"
                >
                  Explore How It Works
                </a>
              </div>

              <div className="mono mt-8 text-[10px] tracking-[0.12em] text-white/30">
                31-DAY AI ENGINEERING CURRICULUM · ADAPTIVE FOLLOW-UPS ·
                PERSONALIZED FEEDBACK
              </div>
            </motion.div>

            <LiveInterview />
          </div>
        </section>

        <section className="border-y border-white/10 px-6 py-10">
          <p className="mx-auto max-w-5xl text-center text-xl font-medium leading-8 text-white/70 sm:text-2xl">
            Don't just test what candidates know.{" "}
            <span className="text-[var(--primary-glow)]">
              Test how deeply they understand it.
            </span>
          </p>
        </section>

        <section
          id="how-it-works"
          className="mx-auto max-w-7xl px-6 py-28"
        >
          <SectionHeader
            label="How PROBEX Thinks"
            title="Answer → Understand → Probe → Adapt"
            description="The interface makes the intelligence visible instead of hiding it behind a chatbot."
          />

          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stages.map(([number, title, text]) => (
              <motion.div
                key={number}
                whileHover={{ y: -5 }}
                className="glass glass-hover relative overflow-hidden rounded-2xl p-7"
              >
                <span className="mono text-5xl font-bold text-white/[0.07]">
                  {number}
                </span>
                <h3 className="mono mt-10 text-sm font-bold tracking-[0.15em]">
                  {title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-white/45">
                  {text}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section
          id="features"
          className="border-y border-white/10 bg-black/10 px-6 py-28"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              label="Core Intelligence"
              title="Built to investigate understanding."
              description="Every component exists to communicate a specific part of the adaptive interview experience."
            />

            <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon

                return (
                  <motion.div
                    key={feature.title}
                    whileHover={{ y: -5 }}
                    className="glass glass-hover rounded-2xl p-7"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--primary-glow)]">
                      <Icon size={21} />
                    </div>

                    <h3 className="mt-6 text-lg font-semibold">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-white/45">
                      {feature.text}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        <section id="curriculum" className="mx-auto max-w-7xl px-6 py-28">
          <SectionHeader
            label="31-Day Curriculum"
            title="Built Around Your Learning Journey"
            description="From foundations to production AI systems."
          />

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {curriculum.map((item, index) => (
              <div
                key={item}
                className="glass rounded-xl p-5"
              >
                <span className="mono-label text-white/25">
                  DAY {index * 4 + 1}+
                </span>

                <p className="mt-4 font-medium text-white/75">
                  {item}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {[
              "RAG",
              "Vector Search",
              "Prompt Engineering",
              "Agents",
              "MCP",
              "Evaluation",
              "Security",
              "Deployment",
              "Production",
            ].map((topic) => (
              <span
                key={topic}
                className="rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 text-xs text-white/45"
              >
                {topic}
              </span>
            ))}
          </div>
        </section>

        <section className="px-6 pb-28">
          <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/[0.025] p-8 text-center sm:p-14">
            <Sparkles className="mx-auto text-[var(--gold)]" size={25} />

            <h2 className="mt-5 text-3xl font-semibold sm:text-5xl">
              Ready to be interviewed properly?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-white/45">
              Test your understanding. Discover your gaps. Know what to learn
              next.
            </p>

            <Link
              to="/candidates"
              className="mt-8 inline-flex items-center rounded-xl bg-[var(--primary)] px-6 py-3.5 font-semibold"
            >
              Start Interview <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function SectionHeader({
  label,
  title,
  description,
}: {
  label: string
  title: string
  description: string
}) {
  return (
    <div className="max-w-3xl">
      <div className="mono-label text-[var(--primary-glow)]">
        {label}
      </div>

      <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
        {title}
      </h2>

      <p className="mt-5 text-base leading-7 text-white/45">
        {description}
      </p>
    </div>
  )
}

function LiveInterview() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.15 }}
      className="relative"
    >
      <div className="hero-glow inset-0 mx-auto my-auto opacity-70" />

      <div className="glass relative rounded-3xl p-4 shadow-2xl shadow-black/40 sm:p-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="mono-label flex items-center gap-2 text-[var(--cyan)]">
            <Radar size={15} />
            Live Adaptive Interview
          </div>

          <div className="flex items-center gap-2 text-[10px] text-white/30">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
            ANALYZING
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="mono-label text-white/30">
              Candidate Profile
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <div className="mono text-lg">Candidate 001</div>
                <div className="mt-1 text-sm text-white/40">
                  26 / 31 Days
                </div>
              </div>

              <div className="mono text-2xl text-[var(--primary-glow)]">
                82%
              </div>
            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "82%" }}
                transition={{ duration: 1.1 }}
                className="h-full rounded-full bg-[var(--primary)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {["RAG", "Vector Search", "Agents"].map((topic, i) => (
              <div
                key={topic}
                className={`rounded-xl border p-4 ${
                  i === 0
                    ? "border-[var(--gold)]/30 bg-[var(--gold)]/5"
                    : "border-white/10 bg-white/[0.02]"
                }`}
              >
                <div className="mono-label text-white/25">
                  {i === 0 ? "ACTIVE" : "TOPIC"}
                </div>
                <div className="mt-2 text-xs text-white/70">
                  {topic}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-[var(--primary)]/25 bg-[var(--primary)]/5 p-5">
            <div className="mono-label text-[var(--primary-glow)]">
              Adaptive Follow-Up
            </div>

            <p className="mt-4 text-sm leading-6 text-white/70">
              You mentioned external knowledge. Suppose the retriever
              returns two contradictory documents. How would you design the
              system to handle that?
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs text-white/35">
              <Crosshair size={14} />
              Reasoning depth increased
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}