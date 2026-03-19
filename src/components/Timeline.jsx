import PhaseColumn from "./PhaseColumn"
import Port from "./Port"

export default function Timeline({
  phases,
  categories,
  activeCategories,
  showDetails,
  activePhaseId,
  portDeadlines,
  selectedDurations,
  onDurationChange,
}) {
  return (
    <div className="timeline-scroll">
      <div className="timeline">
        <div className="timeline-end-spacer" />
        {phases.map((phase) => (
          <div key={phase.id} id={phase.id} className="phase-unit">
            <PhaseColumn
              phase={phase}
              categories={categories}
              activeCategories={activeCategories}
              showDetails={showDetails}
              isActive={phase.id === activePhaseId}
              selectedDuration={selectedDurations[phase.id]}
              onDurationChange={onDurationChange}
            />
            {phase.port && (
              <Port
                port={{ ...phase.port, deadline: portDeadlines[phase.id] ?? phase.port.deadline }}
                isActive={phase.id === activePhaseId}
              />
            )}
          </div>
        ))}
        <div className="timeline-end-spacer" />
      </div>
    </div>
  )
}
