import { useState, useMemo } from "react"
import data from "./data/data.json"
import FilterBar from "./components/FilterBar"
import TimelineBar from "./components/TimelineBar"
import Timeline from "./components/Timeline"
import { calculatePortDeadlines } from "./utils/timeline"
import "./App.css"

function App() {
  const [activeCategories, setActiveCategories] = useState([])
  const [showDetails, setShowDetails] = useState(false)
  const [activePhaseId, setActivePhaseId] = useState(data.phases[0]?.id)
  const [preProductionDate, setPreProductionDate] = useState("2025-09-15")
  const [selectedDurations, setSelectedDurations] = useState({ "phase-8": 10 })
  const [confirmedDurations, setConfirmedDurations] = useState(new Set())

  const portDeadlines = useMemo(
    () => calculatePortDeadlines(data.phases, preProductionDate, selectedDurations),
    [preProductionDate, selectedDurations]
  )

  const toggleCategory = (id) => {
    setActiveCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const handleDurationChange = (phaseId, dur) => {
    setSelectedDurations((prev) => ({ ...prev, [phaseId]: dur }))
    setConfirmedDurations((prev) => new Set(prev).add(phaseId))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Vår produktionsprocess</h1>
        <p className="subtitle">Version 0 skapad 19 mars 2026</p>
      </header>
      <FilterBar
        categories={data.categories}
        active={activeCategories}
        onToggle={toggleCategory}
        showDetails={showDetails}
        onToggleDetails={() => setShowDetails((v) => !v)}
        preProductionDate={preProductionDate}
        onPreProductionDateChange={setPreProductionDate}
        genrepDate={portDeadlines["phase-10"]}
      />
      <TimelineBar
        phases={data.phases}
        activeId={activePhaseId}
        onActiveChange={setActivePhaseId}
        selectedDurations={selectedDurations}
        confirmedDurations={confirmedDurations}
      />
      <Timeline
        phases={data.phases}
        categories={data.categories}
        activeCategories={activeCategories}
        showDetails={showDetails}
        activePhaseId={activePhaseId}
        portDeadlines={portDeadlines}
        selectedDurations={selectedDurations}
        onDurationChange={handleDurationChange}
      />
    </div>
  )
}

export default App
