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
  preProductionDate,
  onPreProductionDateChange,
  genrepDate,
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
      <div className="toggle-bar">
        <DetailsToggle showDetails={showDetails} onToggle={onToggleDetails} />
        <span className="toggle-bar-divider" />
        <label className="toggle-bar-item">
          Pre-produktionsbeslut
          <input
            type="date"
            className="toggle-bar-date"
            value={preProductionDate}
            onChange={(e) => onPreProductionDateChange(e.target.value)}
          />
        </label>
        {genrepDate && (
          <>
            <span className="toggle-bar-divider" />
            <span className="toggle-bar-item">Genrep: <strong>{genrepDate}</strong></span>
          </>
        )}
      </div>
    </div>
  );
}
