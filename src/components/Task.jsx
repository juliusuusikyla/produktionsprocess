import { useState } from "react"

export default function Task({ task, categories, showDetails }) {
  const [expanded, setExpanded] = useState(false)
  const hasContent = Boolean(task.content)
  const visible = showDetails || expanded

  const category = categories.find((c) => c.id === task.category_id)

  return (
    <div className="task">
      <div className="task-header">
        <div className="task-meta">
          <span className="task-title">{task.title}</span>
          {category && <span className="task-category">{category.label}</span>}
        </div>
        {hasContent && (
          <button
            className={`task-toggle${visible ? " open" : ""}`}
            onClick={() => !showDetails && setExpanded((e) => !e)}
            aria-label="Visa detaljer"
          >
            ›
          </button>
        )}
      </div>
      {visible && hasContent && (
        <p className="task-content">{task.content}</p>
      )}
    </div>
  )
}
