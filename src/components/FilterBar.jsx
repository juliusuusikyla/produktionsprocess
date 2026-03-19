function DetailsToggle({ showDetails, onToggle }) {
  return (
    <button className="details-toggle" onClick={onToggle}>
      {showDetails ? "Göm detaljer" : "Visa detaljer"}
    </button>
  )
}

export default function FilterBar({ categories, active, onToggle, showDetails, onToggleDetails }) {
  return (
    <div className="filter-bar">
      <div className="filter-categories">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`filter-btn${active.includes(cat.id) ? " active" : ""}`}
            onClick={() => onToggle(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <DetailsToggle showDetails={showDetails} onToggle={onToggleDetails} />
    </div>
  )
}
