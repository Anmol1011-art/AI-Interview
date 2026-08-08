import { Link } from "@tanstack/react-router"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { Logo } from "./Logo"

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
        <div className="glass rounded-2xl px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            <Link to="/" onClick={() => setOpen(false)}>
              <Logo />
            </Link>

            <nav className="hidden items-center gap-7 md:flex">
              <a href="/#how-it-works" className="text-sm text-white/60 hover:text-white">
                How It Works
              </a>
              <a href="/#features" className="text-sm text-white/60 hover:text-white">
                Features
              </a>
              <a href="/#curriculum" className="text-sm text-white/60 hover:text-white">
                Curriculum
              </a>
              <Link
                to="/interview"
                className="text-sm text-white/60 hover:text-white"
              >
                Interview
              </Link>
            </nav>

            <div className="hidden md:block">
              <Link
                to="/candidates"
                className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-950/40 transition hover:-translate-y-0.5 hover:bg-[var(--primary-glow)]"
              >
                Start Interview →
              </Link>
            </div>

            <button
              type="button"
              aria-label="Toggle navigation"
              className="rounded-lg border border-white/10 p-2 md:hidden"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {open && (
            <nav className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 md:hidden">
              <a href="/#how-it-works" onClick={() => setOpen(false)}>
                How It Works
              </a>
              <a href="/#features" onClick={() => setOpen(false)}>
                Features
              </a>
              <a href="/#curriculum" onClick={() => setOpen(false)}>
                Curriculum
              </a>
              <Link to="/interview" onClick={() => setOpen(false)}>
                Interview
              </Link>
              <Link
                to="/candidates"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-xl bg-[var(--primary)] px-4 py-3 text-center font-semibold"
              >
                Start Interview →
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}