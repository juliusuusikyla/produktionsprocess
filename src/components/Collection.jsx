import Task from "./Task"
import { resolveItems } from "../utils/tasks"

export default function Collection({ collection, categories, showDetails }) {
  const items = resolveItems(collection.tasks)

  return (
    <div className="collection">
      <div className="collection-title">{collection.title}</div>
      {collection.notes && <p className="collection-notes">{collection.notes}</p>}
      {items.map((item, idx) => {
        if (item.type === "shelf") {
          return (
            <div key={`shelf-${item.label}-${idx}`} className="shelf-header">
              {item.label}
            </div>
          )
        }
        if (item.type === "tree") {
          return (
            <div key={`tree-${item.predecessor.id}`} className="gantt-tree">
              <Task task={item.predecessor} categories={categories} showDetails={showDetails} />
              <div className="gantt-successors">
                {item.successors.map((s) => (
                  <div key={s.id} className="gantt-successor-row">
                    <span className="gantt-arrow">→</span>
                    <Task task={s} categories={categories} showDetails={showDetails} />
                  </div>
                ))}
              </div>
            </div>
          )
        }
        return (
          <Task key={item.task.id ?? idx} task={item.task} categories={categories} showDetails={showDetails} />
        )
      })}
    </div>
  )
}
