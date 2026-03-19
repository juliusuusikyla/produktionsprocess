import { useState, useEffect } from "react"

export default function TimelineOverview({ phases, activeId, onActiveChange }) {
  useEffect(() => {
    const scrollEl = document.querySelector(".timeline-scroll")
    if (!scrollEl) return

    const ratios = {}

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { ratios[e.target.id] = e.intersectionRatio })
        const top = Object.entries(ratios).sort((a, b) => b[1] - a[1])[0]
        if (top) onActiveChange(top[0])
      },
      { root: scrollEl, threshold: [0, 0.25, 0.5, 0.75, 1] }
    )

    phases.forEach((phase) => {
      const el = document.getElementById(phase.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [phases])

  const scrollToPhase = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    })
  }

  return (
    <div className="timeline-overview">
      {phases.map((phase, i) => (
        <div key={phase.id} className="overview-item">
          <button
            className={`overview-circle${activeId === phase.id ? " active" : ""}`}
            onClick={() => scrollToPhase(phase.id)}
            title={phase.name}
          />
          {i < phases.length - 1 && <div className="overview-line" />}
        </div>
      ))}
    </div>
  )
}
