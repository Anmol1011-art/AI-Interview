import { Link } from "@tanstack/react-router"
import { Logo } from "./Logo"

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 md:flex-row md:items-end md:justify-between">
        <div>
          <Logo />

          <p className="mt-4 max-w-sm text-sm leading-6 text-white/45">
            The Interviewer That Thinks Beyond the Answer.
          </p>

          <p className="mono-label mt-6 text-white/30">
            Adaptive AI Interview Engine
          </p>
        </div>

        <div className="flex flex-wrap gap-5 text-sm text-white/45">
          <a href="/#how-it-works">How It Works</a>
          <a href="/#features">Features</a>
          <a href="/#curriculum">Curriculum</a>
          <Link to="/interview">Interview</Link>
        </div>
      </div>
    </footer>
  )
}