import PhaseColumn from "./PhaseColumn"
import Port from "./Port"

export default function Timeline({ phases, categories, activeCategories, showDetails }) {
  return (
    <div className="timeline-scroll">
      <div className="timeline">
        {phases.map((phase) => (
          <div key={phase.id} className="phase-unit">
            <PhaseColumn
              phase={phase}
              categories={categories}
              activeCategories={activeCategories}
              showDetails={showDetails}
            />
            {phase.port && <Port port={phase.port} />}
          </div>
        ))}
      </div>
    </div>
  )
}
