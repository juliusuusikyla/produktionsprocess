import Task from "./Task"
import Collection from "./Collection"

export default function PhaseColumn({
  phase,
  categories,
  activeCategories,
  showDetails,
  isActive,
  selectedDuration,
  onDurationChange,
}) {
  const filtering = activeCategories.length > 0
  const isMultiDuration = Array.isArray(phase.duration_num)

  const visibleTasks = filtering
    ? phase.tasks.filter((t) => activeCategories.includes(t.category_id))
    : phase.tasks

  const visibleCollections = phase.collections
    .map((col) => ({
      ...col,
      tasks: filtering
        ? col.tasks.filter((t) => activeCategories.includes(t.category_id))
        : col.tasks,
    }))
    .filter((col) => !filtering || col.tasks.length > 0)

  return (
    <div className="phase-column">
      <div
        className={`phase-header${isActive ? " active" : ""}`}
        onClick={() =>
          document.getElementById(phase.id)?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
        }
      >
        <span className="phase-name">{phase.name}</span>
        {phase.duration && !isMultiDuration && (
          <span className="phase-duration">{phase.duration}</span>
        )}
        {isMultiDuration && (
          <div
            className="phase-duration-radio"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="phase-duration-label">Längd:</span>
            {phase.duration_num.map((d) => (
              <label key={d} className="phase-duration-option">
                <input
                  type="radio"
                  name={`duration-${phase.id}`}
                  value={d}
                  checked={(selectedDuration ?? phase.duration_num[phase.duration_num.length - 1]) === d}
                  onChange={() => onDurationChange(phase.id, d)}
                />
                {d}
              </label>
            ))}
          </div>
        )}
      </div>
      <div className="phase-content">
        {visibleTasks.map((task) => (
          <Task key={task.id} task={task} categories={categories} showDetails={showDetails} />
        ))}
        {visibleCollections.map((col) => (
          <Collection key={col.id} collection={col} categories={categories} showDetails={showDetails} />
        ))}
      </div>
    </div>
  )
}
