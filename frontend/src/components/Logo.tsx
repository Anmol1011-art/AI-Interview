import { Radar } from "lucide-react"

interface LogoProps {
  compact?: boolean
}

export function Logo({ compact = false }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
        <Radar
          size={20}
          strokeWidth={1.7}
          className="text-[var(--primary-glow)]"
        />
        <span className="absolute h-1.5 w-1.5 rounded-full bg-[var(--cyan)] shadow-[0_0_12px_var(--cyan)]" />
      </div>

      {!compact && (
        <span className="mono text-sm font-bold tracking-[0.18em]">
          PROBEX <span className="text-[var(--primary-glow)]">AI</span>
        </span>
      )}
    </div>
  )
}