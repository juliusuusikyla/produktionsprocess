import { CATEGORY_COLORS } from "../categoryColors";

function DetailsToggle({ showDetails, onToggle }) {
  return (
    <button className="details-toggle" onClick={onToggle}>
      {showDetails ? "Göm detaljer" : "Visa detaljer"}
    </button>
  );
}

export default function FilterBar({
  categories,
  active,
  onToggle,
  showDetails,
  onToggleDetails,
}) {
  return (
    <div className="filter-bar">
      <div className="filter-categories">
        {categories.map((cat) => {
          const color = CATEGORY_COLORS[cat.id];
          return (
            <button
              key={cat.id}
              className={`filter-btn${active.includes(cat.id) ? " active" : ""}`}
              onClick={() => onToggle(cat.id)}
            >
              <span className="filter-btn-dot" style={{ background: color }} />
              {cat.label}
            </button>
          );
        })}
      </div>
      <div classname="toggle-bar">
        <DetailsToggle showDetails={showDetails} onToggle={onToggleDetails} />
      </div>
    </div>
  );
}
