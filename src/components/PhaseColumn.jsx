import Task from "./Task"
import Collection from "./Collection"

export default function PhaseColumn({ phase, categories, activeCategories, showDetails, isActive }) {
  const filtering = activeCategories.length > 0

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
        {phase.duration && (
          <span className="phase-duration">{phase.duration}</span>
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
