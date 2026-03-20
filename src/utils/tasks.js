/**
 * Transforms a flat task array into a list of render items, handling:
 *
 *  - Shelf grouping: tasks sharing a shelf value are placed under a shelf
 *    header inserted at the first transition to that shelf label.
 *
 *  - Gantt trees: if task B has gantt === task A's id (A must happen first),
 *    the tree is emitted AT TASK A'S ORIGINAL POSITION. Task B (and any other
 *    successors of A) are skipped from their own positions and rendered inside
 *    the tree. This keeps predecessor cards where the user expects them and
 *    avoids "disappearing" cards.
 *
 *    Supports 1→many: multiple tasks with gantt === A.id all appear as
 *    stacked successors in the same tree item.
 *
 * Returns an array of:
 *   { type: 'shelf', label }
 *   { type: 'task',  task }
 *   { type: 'tree',  predecessor, successors }
 */
/**
 * Filter tasks by active categories, but always include any predecessor task
 * (task_gantt) that a matched task depends on, even if it's in another category.
 * Preserves original task order.
 */
export function filterTasks(tasks, activeCategories) {
  if (!activeCategories || activeCategories.length === 0) return tasks
  const byId = Object.fromEntries(tasks.map((t) => [t.id, t]))
  const included = new Set(
    tasks.filter((t) => activeCategories.includes(t.category_id)).map((t) => t.id)
  )
  // Pull in predecessors of any included task
  tasks.forEach((t) => {
    if (included.has(t.id) && t.gantt && byId[t.gantt]) {
      included.add(t.gantt)
    }
  })
  return tasks.filter((t) => included.has(t.id))
}

export function resolveItems(tasks) {
  const byId = {}
  tasks.forEach((t) => { if (t.id) byId[t.id] = t })

  // Build: predecessorId -> ordered list of successors
  const successorsMap = {}
  tasks.forEach((t) => {
    if (t.gantt && byId[t.gantt]) {
      if (!successorsMap[t.gantt]) successorsMap[t.gantt] = []
      successorsMap[t.gantt].push(t)
    }
  })

  // Successor ids are skipped in normal flow — they appear inside their
  // predecessor's tree item instead.
  const successorIds = new Set()
  Object.values(successorsMap).forEach((list) => list.forEach((t) => successorIds.add(t.id)))

  const items = []
  let currentShelf = undefined

  tasks.forEach((task) => {
    if (!task.id && !task.title) return     // skip empty placeholder rows
    if (successorIds.has(task.id)) return   // rendered inside predecessor's tree

    const shelf = task.shelf ?? null
    if (shelf !== currentShelf) {
      currentShelf = shelf
      if (shelf) items.push({ type: 'shelf', label: shelf })
    }

    if (successorsMap[task.id]) {
      // This task is a predecessor — emit tree here, at its natural position
      items.push({ type: 'tree', predecessor: task, successors: successorsMap[task.id] })
    } else {
      items.push({ type: 'task', task })
    }
  })

  return items
}
