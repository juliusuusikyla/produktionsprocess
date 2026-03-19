/**
 * Adds a number of months to a YYYY-MM-DD date string.
 * Handles month-end overflow (e.g. Jan 31 + 1 month = Feb 28/29).
 */
export function addMonths(dateStr, months) {
  const d = new Date(dateStr)
  d.setMonth(d.getMonth() + months)
  return d.toISOString().slice(0, 10)
}

/**
 * Formats a YYYY-MM-DD string to a human-readable "D Mon YYYY" form.
 */
export function formatDate(dateStr) {
  if (!dateStr) return null
  const [year, month, day] = dateStr.split("-").map(Number)
  const monthNames = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"]
  return `${day} ${monthNames[month - 1]} ${year}`
}

/**
 * Calculates port deadlines for all phases based on:
 *  - preProductionDate: the anchor date for phase-2's port
 *  - selectedDurations: { phaseId: number } overrides for multi-value phases
 *
 * Returns { phaseId: "YYYY-MM-DD" } for each phase that has a port and a known duration.
 */
export function calculatePortDeadlines(phases, preProductionDate, selectedDurations = {}) {
  const deadlines = {}
  let currentDate = preProductionDate
  let started = false

  for (const phase of phases) {
    if (phase.id === "phase-2") {
      deadlines[phase.id] = currentDate
      started = true
      continue
    }

    if (!started) continue

    const rawDur = phase.duration_num
    if (rawDur == null) continue

    const dur = Array.isArray(rawDur)
      ? (selectedDurations[phase.id] ?? rawDur[rawDur.length - 1])
      : rawDur

    currentDate = addMonths(currentDate, dur)

    if (phase.port) {
      deadlines[phase.id] = currentDate
    }
  }

  return deadlines
}
