import { useState } from "react"
import data from "./data/data.json"
import FilterBar from "./components/FilterBar"
import TimelineBar from "./components/TimelineBar"
import Timeline from "./components/Timeline"
import "./App.css"

function App() {
  const [activeCategories, setActiveCategories] = useState([])
  const [showDetails, setShowDetails] = useState(false)
  const [activePhaseId, setActivePhaseId] = useState(data.phases[0]?.id)

  const toggleCategory = (id) => {
    setActiveCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
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
      />
      <TimelineBar phases={data.phases} activeId={activePhaseId} onActiveChange={setActivePhaseId} />
      <Timeline
        phases={data.phases}
        categories={data.categories}
        activeCategories={activeCategories}
        showDetails={showDetails}
        activePhaseId={activePhaseId}
      />
    </div>
  )
}

export default App
