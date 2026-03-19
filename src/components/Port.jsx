export default function Port({ port, isActive }) {
  return (
    <div className="port">
      <span className={`port-icon${isActive ? " active" : ""}`}>!</span>
      <span className="port-title">{port.title}</span>
      {port.deadline && (
        <span className="port-deadline">
          {isActive ? <mark className="port-deadline-mark">{port.deadline}</mark> : port.deadline}
        </span>
      )}
      {port.content && <p className="port-content">{port.content}</p>}
    </div>
  )
}
