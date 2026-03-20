import { useEffect } from "react"

const PX_PER_MONTH = 24

const MIN_LINE = 22 // one node-circle width, used as a visual gap for 0-month phases

function getLineWidth(phase, selectedDurations) {
  const dur = phase.duration_num
  if (dur == null) return 32
  const num = Array.isArray(dur)
    ? (selectedDurations[phase.id] ?? dur[dur.length - 1])
    : dur
  return Math.max(num * PX_PER_MONTH, MIN_LINE)
}

export default function TimelineBar({ phases, activeId, onActiveChange, selectedDurations, confirmedDurations }) {
  useEffect(() => {
    // Center the first phase immediately on mount (no animation)
    const el = document.getElementById(phases[0]?.id)
    if (el) el.scrollIntoView({ behavior: "instant", inline: "center", block: "nearest" })
  }, [])

  useEffect(() => {
    const scrollEl = document.querySelector(".timeline-scroll")
    if (!scrollEl) return

    const update = () => {
      const containerRect = scrollEl.getBoundingClientRect()
      const containerCenter = containerRect.left + containerRect.width / 2
      let closestId = null
      let closestDist = Infinity

      phases.forEach((phase) => {
        const el = document.getElementById(phase.id)
        if (!el) return
        const rect = el.getBoundingClientRect()
        const elCenter = rect.left + rect.width / 2
        const dist = Math.abs(elCenter - containerCenter)
        if (dist < closestDist) {
          closestDist = dist
          closestId = phase.id
        }
      })

      if (closestId) onActiveChange(closestId)
    }

    scrollEl.addEventListener("scroll", update)
    update()

    return () => scrollEl.removeEventListener("scroll", update)
  }, [phases])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return
      e.preventDefault()
      document.activeElement?.blur()
      const currentIndex = phases.findIndex((p) => p.id === activeId)
      const nextIndex = e.key === "ArrowRight" ? currentIndex + 1 : currentIndex - 1
      if (nextIndex < 0 || nextIndex >= phases.length) return
      scrollToPhase(phases[nextIndex].id)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [phases, activeId])

  const scrollToPhase = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    })
  }

  const currentIndex = phases.findIndex((p) => p.id === activeId)
  const canGoLeft = currentIndex > 0
  const canGoRight = currentIndex < phases.length - 1

  return (
    <>
    {canGoLeft && (
      <button className="nav-arrow nav-arrow-left" onClick={() => scrollToPhase(phases[currentIndex - 1].id)} aria-label="Föregående fas">
        ‹
      </button>
    )}
    {canGoRight && (
      <button className="nav-arrow nav-arrow-right" onClick={() => scrollToPhase(phases[currentIndex + 1].id)} aria-label="Nästa fas">
        ›
      </button>
    )}
    <div className="timeline-bar">
      {phases.map((phase, i) => {
        const isActive = activeId === phase.id
        return (
          <div key={phase.id} className="bar-item">
            <button
              className={`bar-node${isActive ? " active" : ""}`}
              onClick={() => scrollToPhase(phase.id)}
              title={phase.name}
            >
              {isActive ? phase.name : i + 1}
            </button>
            {i < phases.length - 1 && (() => {
              const dashed =
                Array.isArray(phase.duration_num) &&
                activeId !== phase.id &&
                !confirmedDurations.has(phase.id)
              return (
                <div
                  className="bar-line"
                  style={{
                    width: getLineWidth(phase, selectedDurations),
                    background: dashed
                      ? "repeating-linear-gradient(90deg, pink 0, pink 6px, transparent 6px, transparent 10px)"
                      : undefined,
                  }}
                />
              )
            })()}
          </div>
        )
      })}
    </div>
    </>
  )
}
