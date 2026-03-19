import Task from "./Task"

export default function Collection({ collection, categories, showDetails }) {
  return (
    <div className="collection">
      <div className="collection-title">{collection.title}</div>
      {collection.notes && <p className="collection-notes">{collection.notes}</p>}
      {collection.tasks.map((task) => (
        <Task key={task.id} task={task} categories={categories} showDetails={showDetails} />
      ))}
    </div>
  )
}
